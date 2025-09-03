import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UI_CONSTANTS } from '../constants';
import { normalize } from '../utils/normalize';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isSecure = secureTextEntry && !isPasswordVisible;
  const showPasswordToggle = secureTextEntry;

  const inputStyle = [
    styles.input,
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    style,
  ];

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={normalize(20)}
            color={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={inputStyle}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={normalize(20)}
              color={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons
              name={rightIcon}
              size={normalize(20)}
              color={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  label: {
    fontSize: normalize(16),
    fontWeight: '500',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: normalize(48),
    borderWidth: normalize(1),
    borderColor: '#E5E5EA',
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    fontSize: normalize(16),
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
  },
  inputWithLeftIcon: {
    paddingLeft: normalize(48),
  },
  inputWithRightIcon: {
    paddingRight: normalize(48),
  },
  inputFocused: {
    borderColor: UI_CONSTANTS.COLORS.PRIMARY,
    borderWidth: normalize(2),
  },
  inputError: {
    borderColor: UI_CONSTANTS.COLORS.ERROR,
  },
  leftIcon: {
    position: 'absolute',
    left: UI_CONSTANTS.SPACING.MD,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: UI_CONSTANTS.SPACING.MD,
    zIndex: 1,
    padding: UI_CONSTANTS.SPACING.SM,
  },
  errorText: {
    fontSize: normalize(14),
    color: UI_CONSTANTS.COLORS.ERROR,
    marginTop: UI_CONSTANTS.SPACING.XS,
  },
});
