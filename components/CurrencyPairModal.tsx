import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { CURRENCY_PAIRS, CurrencyPair } from '../constants/CurrencyPairs';

interface CurrencyPairModalProps {
  visible: boolean;
  selected: CurrencyPair;
  onSelect: (pair: CurrencyPair) => void;
  onClose: () => void;
}

const CATEGORIES = ['All', 'Major', 'Minor', 'Exotic'] as const;
type Category = typeof CATEGORIES[number];

export function CurrencyPairModal({
  visible,
  selected,
  onSelect,
  onClose,
}: CurrencyPairModalProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('All');

  const filtered = CURRENCY_PAIRS.filter(p => {
    const matchSearch = p.symbol.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Currency Pair</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search pairs..."
            placeholderTextColor={Colors.textMuted}
            autoCorrect={false}
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

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.symbol}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isSelected = item.symbol === selected.symbol;
            return (
              <TouchableOpacity
                style={[styles.item, isSelected && styles.itemSelected]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.itemLeft}>
                  <Text style={styles.itemSymbol}>{item.symbol}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemPipLabel}>Pip value / lot</Text>
                  <Text style={[styles.itemPipValue, isSelected && { color: Colors.primary }]}>
                    ${item.pipValuePerLot.toFixed(2)}
                  </Text>
                </View>
                {isSelected && <View style={styles.selectedDot} />}
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primaryGlow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  closeBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
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
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.primaryLight,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: Colors.glass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginVertical: 3,
  },
  itemSelected: {
    borderColor: 'rgba(59,130,246,0.4)',
    backgroundColor: 'rgba(59,130,246,0.06)',
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemPipLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  itemPipValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 10,
  },
  separator: {
    height: 0,
  },
});
