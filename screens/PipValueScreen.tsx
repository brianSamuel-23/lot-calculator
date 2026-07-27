import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { CURRENCY_PAIRS, CurrencyPair } from '../constants/CurrencyPairs';
import { GlassCard } from '../components/GlassCard';

const CATEGORIES = ['All', 'Major', 'Minor', 'Exotic'] as const;
type Category = typeof CATEGORIES[number];

function PipRow({ pair, lotSize }: { pair: CurrencyPair; lotSize: number }) {
  const pipValue = pair.pipValuePerLot * lotSize;
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowSymbol}>{pair.symbol}</Text>
        <View style={[styles.badge, { backgroundColor: categoryColor(pair.category) + '18' }]}>
          <Text style={[styles.badgeText, { color: categoryColor(pair.category) }]}>
            {pair.category}
          </Text>
        </View>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowPipSize}>
          {pair.pipSize === 0.01 ? '0.01' : '0.0001'}
        </Text>
        <Text style={styles.rowPipValue}>${pipValue.toFixed(pipValue < 1 ? 3 : 2)}</Text>
      </View>
    </View>
  );
}

function categoryColor(cat: string) {
  switch (cat) {
    case 'Major': return Colors.primary;
    case 'Minor': return Colors.gold;
    case 'Exotic': return Colors.danger;
    default: return Colors.textSecondary;
  }
}

export default function PipValueScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [lotSize, setLotSize] = useState('1');

  const filtered = CURRENCY_PAIRS.filter(p => {
    const matchSearch = p.symbol.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const ls = parseFloat(lotSize) || 1;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pip Value Table</Text>
        <Text style={styles.headerSubtitle}>Per-lot pip values in USD</Text>
      </View>

      {/* Lot size selector */}
      <GlassCard style={styles.lotCard}>
        <Text style={styles.lotLabel}>Lot Size Reference</Text>
        <View style={styles.lotButtons}>
          {[0.01, 0.1, 1.0].map(v => (
            <TouchableOpacity
              key={v}
              style={[styles.lotBtn, lotSize === String(v) && styles.lotBtnActive]}
              onPress={() => setLotSize(String(v))}
            >
              <Text style={[styles.lotBtnText, lotSize === String(v) && styles.lotBtnTextActive]}>
                {v === 1 ? 'Standard' : v === 0.1 ? 'Mini' : 'Micro'}
              </Text>
              <Text style={[styles.lotBtnSub, lotSize === String(v) && { color: Colors.primaryLight }]}>
                {v}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.lotCustomWrapper}>
            <TextInput
              style={styles.lotCustom}
              value={lotSize}
              onChangeText={setLotSize}
              keyboardType="decimal-pad"
              placeholder="Custom"
              placeholderTextColor={Colors.textDisabled}
            />
          </View>
        </View>
      </GlassCard>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search pairs..."
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Category tabs */}
      <View style={styles.tabs}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, category === cat && styles.tabActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.tabText, category === cat && styles.tabTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Column headers */}
      <View style={styles.colHeader}>
        <Text style={styles.colHeaderText}>Pair</Text>
        <View style={styles.colHeaderRight}>
          <Text style={[styles.colHeaderText, { marginRight: 20 }]}>Pip Size</Text>
          <Text style={styles.colHeaderText}>Value ({ls}L)</Text>
        </View>
      </View>

      {/* Table */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.symbol}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <PipRow pair={item} lotSize={ls} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 12,
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
  lotCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  lotLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  lotButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  lotBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  lotBtnActive: {
    backgroundColor: Colors.primaryGlow,
    borderColor: 'rgba(59,130,246,0.4)',
  },
  lotBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  lotBtnTextActive: {
    color: Colors.primary,
  },
  lotBtnSub: {
    fontSize: 11,
    color: Colors.textDisabled,
    marginTop: 2,
  },
  lotCustomWrapper: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  lotCustom: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  tabActive: {
    backgroundColor: Colors.primaryGlow,
    borderColor: 'rgba(59,130,246,0.4)',
  },
  tabText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.primaryLight,
  },
  colHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.glassBorder,
  },
  colHeaderRight: {
    flexDirection: 'row',
  },
  colHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  rowRight: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  rowPipSize: {
    fontSize: 13,
    color: Colors.textMuted,
    fontVariant: ['tabular-nums'],
    width: 50,
    textAlign: 'right',
  },
  rowPipValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryLight,
    fontVariant: ['tabular-nums'],
    width: 60,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.glassBorder,
    marginHorizontal: 4,
  },
});
