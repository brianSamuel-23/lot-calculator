import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/Colors';
import { CalculatorResult } from '../hooks/useCalculator';
import { GlassCard } from './GlassCard';

interface ResultCardProps {
  result: CalculatorResult;
  pairSymbol: string;
}

function StatRow({
  label,
  value,
  color,
  large,
  sublabel,
}: {
  label: string;
  value: string;
  color?: string;
  large?: boolean;
  sublabel?: string;
}) {
  return (
    <View style={styles.statRow}>
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        {sublabel ? <Text style={styles.statSublabel}>{sublabel}</Text> : null}
      </View>
      <Text style={[styles.statValue, large && styles.statValueLarge, color ? { color } : {}]}>
        {value}
      </Text>
    </View>
  );
}

export function ResultCard({ result, pairSymbol }: ResultCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (result.isValid) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [result.isValid, result.lotSize]);

  const fmt = (n: number, decimals = 2) =>
    n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const lotDisplay = result.lotSize >= 1
    ? fmt(result.lotSize, 2)
    : result.lotSize >= 0.01
    ? fmt(result.lotSize, 3)
    : fmt(result.lotSize, 4);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      {/* Hero lot size */}
      <GlassCard variant="highlight" style={styles.heroCard}>
        <View style={styles.heroGlow} />
        <Text style={styles.heroLabel}>Recommended Lot Size</Text>
        <Text style={styles.heroValue}>
          {result.isValid ? lotDisplay : '—'}
        </Text>
        <View style={styles.heroSub}>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>
              {result.isValid ? `${fmt(result.miniLots, 2)} mini lots` : '—'}
            </Text>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>
              {result.isValid ? `${fmt(result.microLots, 1)} micro lots` : '—'}
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Stats grid */}
      <GlassCard style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Risk Breakdown · {pairSymbol}</Text>
        <View style={styles.divider} />

        <StatRow
          label="Risk Amount"
          sublabel="Max loss at stop"
          value={result.isValid ? `$${fmt(result.riskAmount)}` : '—'}
          color={Colors.danger}
          large
        />
        <StatRow
          label="Stop Loss Distance"
          sublabel={result.direction ? `${result.direction} position` : 'From entry to stop'}
          value={result.isValid ? `${fmt(result.stopLossPips, 1)} pips` : '—'}
          color={Colors.textSecondary}
        />
        <View style={styles.divider} />
        <StatRow
          label="Pip Value"
          sublabel="At calculated lot size"
          value={result.isValid ? `$${fmt(result.pipValue, 3)}` : '—'}
          color={Colors.primaryLight}
        />
        <StatRow
          label="Pip Value / Lot"
          sublabel={result.isLivePipValue ? 'Live · from entry price' : 'Approx · static reference'}
          value={result.isValid ? `$${fmt(result.pipValuePerLot, 2)}` : '—'}
          color={result.isLivePipValue ? Colors.success : Colors.textSecondary}
        />
        <View style={styles.divider} />
        <StatRow
          label="Total Fee"
          sublabel="Commission at this lot"
          value={result.isValid ? `$${fmt(result.totalFee, 3)}` : '—'}
          color={Colors.gold}
        />
        <StatRow
          label="Break-even Pips"
          sublabel="Pips to cover fee"
          value={result.isValid ? `${fmt(result.breakEvenPips, 1)} pips` : '—'}
          color={Colors.goldLight}
        />
        <View style={styles.divider} />
        <StatRow
          label="Net Risk"
          sublabel="SL loss + fees"
          value={result.isValid ? `$${fmt(result.netRisk)}` : '—'}
          color={Colors.dangerLight}
          large
        />
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 24,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    left: '25%',
    width: '50%',
    height: 100,
    backgroundColor: Colors.primary,
    opacity: 0.07,
    borderRadius: 999,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 52,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -2,
  },
  heroSub: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  heroPill: {
    backgroundColor: 'rgba(59,130,246,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.25)',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  heroPillText: {
    fontSize: 12,
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statSublabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statValueLarge: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.glassBorder,
    marginVertical: 2,
  },
});
