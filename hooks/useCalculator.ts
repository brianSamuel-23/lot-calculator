import { useState, useCallback } from 'react';
import { CurrencyPair, DEFAULT_PAIR } from '../constants/CurrencyPairs';

export type StopLossMode = 'pips' | 'price';

export interface CalculatorInputs {
  accountBalance: string;
  riskPercent: string;
  slMode: StopLossMode;
  stopLossPips: string;
  entryPrice: string;
  stopLossPrice: string;
  feePerLot: string;
  pair: CurrencyPair;
}

export interface CalculatorResult {
  lotSize: number;
  miniLots: number;
  microLots: number;
  riskAmount: number;
  pipValue: number;
  totalFee: number;
  netRisk: number;
  pipValuePerLot: number;
  isLivePipValue: boolean;
  breakEvenPips: number;
  stopLossPips: number;
  direction: 'Long' | 'Short' | null;
  isValid: boolean;
  error?: string;
}

const EMPTY_RESULT: CalculatorResult = {
  lotSize: 0,
  miniLots: 0,
  microLots: 0,
  riskAmount: 0,
  pipValue: 0,
  totalFee: 0,
  netRisk: 0,
  pipValuePerLot: 0,
  isLivePipValue: false,
  breakEvenPips: 0,
  stopLossPips: 0,
  direction: null,
  isValid: false,
};

const DEFAULT_INPUTS: CalculatorInputs = {
  accountBalance: '',
  riskPercent: '1',
  slMode: 'pips',
  stopLossPips: '',
  entryPrice: '',
  stopLossPrice: '',
  feePerLot: '7',
  pair: DEFAULT_PAIR,
};

export function useCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const updateInput = useCallback(<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const calculate = useCallback((): CalculatorResult => {
    const balance = parseFloat(inputs.accountBalance);
    const risk = parseFloat(inputs.riskPercent);
    const fee = parseFloat(inputs.feePerLot) || 0;
    const { pipSize } = inputs.pair;

    // Validation
    if (!inputs.accountBalance || isNaN(balance) || balance <= 0) {
      return { ...EMPTY_RESULT, error: 'Enter a valid account balance' };
    }
    if (!inputs.riskPercent || isNaN(risk) || risk <= 0 || risk > 100) {
      return { ...EMPTY_RESULT, error: 'Risk % must be between 0 and 100' };
    }

    let slPips: number;
    let direction: 'Long' | 'Short' | null = null;

    // The pip value of pairs quoted in a currency other than USD moves with
    // the exchange rate (e.g. USD/JPY at 162.5 has a lower pip value than at
    // 146), so the static table value goes stale as the market moves. When
    // the user gives us a live entry price and USD is the base currency, we
    // can derive the exact pip value instead of relying on that approximation.
    let pipValuePerLot = inputs.pair.pipValuePerLot;
    let isLivePipValue = false;

    if (inputs.slMode === 'price') {
      const entry = parseFloat(inputs.entryPrice);
      const stop = parseFloat(inputs.stopLossPrice);

      if (!inputs.entryPrice || isNaN(entry) || entry <= 0) {
        return { ...EMPTY_RESULT, error: 'Enter a valid entry price' };
      }
      if (!inputs.stopLossPrice || isNaN(stop) || stop <= 0) {
        return { ...EMPTY_RESULT, error: 'Enter a valid stop loss price' };
      }
      if (entry === stop) {
        return { ...EMPTY_RESULT, error: 'Entry and stop loss cannot be the same price' };
      }

      slPips = Math.abs(entry - stop) / pipSize;
      direction = stop < entry ? 'Long' : 'Short';

      if (inputs.pair.base === 'USD') {
        pipValuePerLot = (pipSize * 100_000) / entry;
        isLivePipValue = true;
      }
    } else {
      slPips = parseFloat(inputs.stopLossPips);
      if (!inputs.stopLossPips || isNaN(slPips) || slPips <= 0) {
        return { ...EMPTY_RESULT, error: 'Enter a valid stop loss in pips' };
      }
    }

    // Core calculation
    // Risk Amount = account balance × risk%
    const riskAmount = balance * (risk / 100);

    // Cost per lot = (stop loss pips × pip value per lot) + fee per lot
    const costPerLot = slPips * pipValuePerLot + fee;

    if (costPerLot <= 0) {
      return { ...EMPTY_RESULT, error: 'Invalid cost per lot calculation' };
    }

    // Lot size = risk amount / cost per lot
    const lotSize = riskAmount / costPerLot;

    // Pip value at calculated lot size
    const pipValue = lotSize * pipValuePerLot;

    // Total fee at calculated lot size
    const totalFee = lotSize * fee;

    // Net risk = stop loss amount + fee
    const netRisk = slPips * pipValue + totalFee;

    // Break-even pips (to cover the fee)
    const breakEvenPips = fee > 0 ? fee / pipValuePerLot : 0;

    return {
      lotSize: Math.max(0, lotSize),
      miniLots: Math.max(0, lotSize * 10),
      microLots: Math.max(0, lotSize * 100),
      riskAmount,
      pipValue,
      totalFee,
      netRisk,
      pipValuePerLot,
      isLivePipValue,
      breakEvenPips,
      stopLossPips: slPips,
      direction,
      isValid: true,
    };
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  return { inputs, updateInput, calculate, reset };
}
