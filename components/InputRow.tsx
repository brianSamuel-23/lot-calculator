import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  KeyboardTypeOptions,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface InputRowProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  suffix?: string;
  prefix?: string;
  keyboardType?: KeyboardTypeOptions;
  hint?: string;
}

export function InputRow({
  label,
  value,
  onChangeText,
  placeholder = '0',
  suffix,
  prefix,
  keyboardType = 'decimal-pad',
  hint,
}: InputRowProps) {
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.inputBorder, Colors.inputBorderFocus],
  });

  const shadowOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            shadowColor: Colors.primary,
            shadowOpacity,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 },
            elevation: 0,
          },
        ]}
      >
        {prefix ? <Text style={styles.affix}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textDisabled}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={Colors.primary}
        />
        {suffix ? <Text style={styles.affix}>{suffix}</Text> : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  hint: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  affix: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '500',
    marginHorizontal: 4,
  },
});
