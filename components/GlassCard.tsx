import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'highlight' | 'danger' | 'success';
  noPadding?: boolean;
}

export function GlassCard({
  children,
  style,
  variant = 'default',
  noPadding = false,
}: GlassCardProps) {
  const borderColor = {
    default: Colors.glassBorder,
    highlight: Colors.glassBorderBright,
    danger: 'rgba(239,68,68,0.3)',
    success: 'rgba(16,185,129,0.3)',
  }[variant];

  return (
    <View
      style={[
        styles.card,
        { borderColor },
        noPadding && { padding: 0 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
});
