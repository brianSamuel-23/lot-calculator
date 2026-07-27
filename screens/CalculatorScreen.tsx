import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useCalculator } from '../hooks/useCalculator';
import { GlassCard } from '../components/GlassCard';
import { InputRow } from '../components/InputRow';
import { ResultCard } from '../components/ResultCard';
import { CurrencyPairModal } from '../components/CurrencyPairModal';
import { CurrencyPair } from '../constants/CurrencyPairs';

export default function CalculatorScreen() {
  const { inputs, updateInput, calculate, reset } = useCalculator();
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState(calculate());
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const res = calculate();
    setResult(res);
    setHasCalculated(true);
  }, [calculate]);

  const handleReset = useCallback(() => {
    reset();
    setResult(calculate());
    setHasCalculated(false);
  }, [reset, calculate]);

  const riskColor =
    parseFloat(inputs.riskPercent) <= 1
      ? Colors.success
      : parseFloat(inputs.riskPercent) <= 2
      ? Colors.gold
      : Colors.danger;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Lot Calculator</Text>
            <Text style={styles.headerSubtitle}>Position sizing with fee adjustment</Text>
          </View>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>↺ Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <GlassCard style={styles.inputCard}>
          <Text style={styles.sectionLabel}>📊 Account Settings</Text>

          <InputRow
            label="Account Balance"
            value={inputs.accountBalance}
            onChangeText={v => updateInput('accountBalance', v)}
            placeholder="10,000"
            prefix="$"
            hint="USD"
          />

          <View style={styles.riskRow}>
            <View style={styles.riskInputWrapper}>
              <InputRow
                label="Risk Percentage"
                value={inputs.riskPercent}
                onChangeText={v => updateInput('riskPercent', v)}
                placeholder="1"
                suffix="%"
                hint={
                  parseFloat(inputs.riskPercent) <= 1
                    ? '✅ Conservative'
                    : parseFloat(inputs.riskPercent) <= 2
                    ? '⚠️ Moderate'
                    : '🔴 Aggressive'
                }
              />
            </View>
          </View>

          {/* Risk bar */}
          {!!inputs.riskPercent && (
            <View style={styles.riskBarContainer}>
              <View style={styles.riskBarTrack}>
                <View
                  style={[
                    styles.riskBarFill,
                    {
                      width: `${Math.min(parseFloat(inputs.riskPercent) * 20, 100)}%`,
                      backgroundColor: riskColor,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.riskBarLabel, { color: riskColor }]}>
                {parseFloat(inputs.riskPercent) <= 1
                  ? 'Conservative — ideal for consistent growth'
                  : parseFloat(inputs.riskPercent) <= 2
                  ? 'Moderate — manage carefully'
                  : 'High risk — be cautious!'}
              </Text>
            </View>
          )}
        </GlassCard>

        <GlassCard style={styles.inputCard}>
          <Text style={styles.sectionLabel}>💱 Trade Settings</Text>

          {/* Pair selector */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>CURRENCY PAIR</Text>
            <TouchableOpacity
              style={styles.pairSelector}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.pairSymbol}>{inputs.pair.symbol}</Text>
                <Text style={styles.pairMeta}>
                  Pip: {inputs.pair.pipSize} · ${inputs.pair.pipValuePerLot.toFixed(2)}/lot
                </Text>
              </View>
              <Text style={styles.pairChevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Stop loss mode toggle */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>STOP LOSS INPUT</Text>
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeBtn, inputs.slMode === 'pips' && styles.modeBtnActive]}
                onPress={() => updateInput('slMode', 'pips')}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.modeBtnText, inputs.slMode === 'pips' && styles.modeBtnTextActive]}
                >
                  Pips
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, inputs.slMode === 'price' && styles.modeBtnActive]}
                onPress={() => updateInput('slMode', 'price')}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.modeBtnText, inputs.slMode === 'price' && styles.modeBtnTextActive]}
                >
                  Entry / Stop Price
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {inputs.slMode === 'pips' ? (
            <InputRow
              label="Stop Loss"
              value={inputs.stopLossPips}
              onChangeText={v => updateInput('stopLossPips', v)}
              placeholder="20"
              suffix="pips"
              hint={`1 pip = $${(inputs.pair.pipValuePerLot / 100000 * inputs.pair.pipSize * 10_000_000).toFixed(4)}`}
            />
          ) : (
            <>
              <InputRow
                label="Entry Price"
                value={inputs.entryPrice}
                onChangeText={v => updateInput('entryPrice', v)}
                placeholder={inputs.pair.pipSize === 0.01 ? '150.00' : '1.0850'}
                keyboardType="numbers-and-punctuation"
              />
              <InputRow
                label="Stop Loss Price"
                value={inputs.stopLossPrice}
                onChangeText={v => updateInput('stopLossPrice', v)}
                placeholder={inputs.pair.pipSize === 0.01 ? '149.50' : '1.0800'}
                keyboardType="numbers-and-punctuation"
                hint={
                  inputs.entryPrice && inputs.stopLossPrice &&
                  !isNaN(parseFloat(inputs.entryPrice)) && !isNaN(parseFloat(inputs.stopLossPrice))
                    ? `= ${(Math.abs(parseFloat(inputs.entryPrice) - parseFloat(inputs.stopLossPrice)) / inputs.pair.pipSize).toFixed(1)} pips · ${parseFloat(inputs.stopLossPrice) < parseFloat(inputs.entryPrice) ? 'Long' : 'Short'}`
                    : undefined
                }
              />
            </>
          )}

          <InputRow
            label="Fee / Commission per Lot"
            value={inputs.feePerLot}
            onChangeText={v => updateInput('feePerLot', v)}
            placeholder="7"
            prefix="$"
            hint="Per standard lot round-trip"
          />
        </GlassCard>

        {/* Calculate button */}
        <TouchableOpacity
          style={styles.calcButton}
          onPress={handleCalculate}
          activeOpacity={0.85}
        >
          <View style={styles.calcButtonGlow} />
          <Text style={styles.calcButtonText}>Calculate Position Size</Text>
          <Text style={styles.calcButtonIcon}>→</Text>
        </TouchableOpacity>

        {/* Results */}
        {hasCalculated && (
          result.isValid ? (
            <ResultCard result={result} pairSymbol={inputs.pair.symbol} />
          ) : (
            <GlassCard variant="danger" style={styles.errorCard}>
              <Text style={styles.errorText}>⚠️  {result.error}</Text>
            </GlassCard>
          )
        )}

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          * Pip values are approximate and may vary with live market rates.
          Always verify with your broker before trading.
        </Text>
      </ScrollView>

      <CurrencyPairModal
        visible={modalVisible}
        selected={inputs.pair}
        onSelect={(pair: CurrencyPair) => updateInput('pair', pair)}
        onClose={() => setModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.glass,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  resetBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  inputCard: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  riskRow: {
    flexDirection: 'row',
  },
  riskInputWrapper: {
    flex: 1,
  },
  riskBarContainer: {
    marginTop: -4,
    marginBottom: 14,
  },
  riskBarTrack: {
    height: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 6,
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  riskBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  fieldContainer: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pairSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pairSymbol: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  pairMeta: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  pairChevron: {
    fontSize: 24,
    color: Colors.textMuted,
    fontWeight: '300',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: Colors.primary,
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
  },
  calcButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    gap: 8,
  },
  calcButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
  },
  calcButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  calcButtonIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  errorCard: {
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 18,
  },
  errorText: {
    color: Colors.dangerLight,
    fontSize: 15,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.textDisabled,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
});
