import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { UI_CONSTANTS } from '../constants';
import { normalize } from '../utils/normalize';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : UI_CONSTANTS.COLORS.PRIMARY}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
  },
  secondary: {
    backgroundColor: UI_CONSTANTS.COLORS.SECONDARY,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: normalize(1),
    borderColor: UI_CONSTANTS.COLORS.PRIMARY,
  },
  small: {
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    minHeight: normalize(36),
  },
  medium: {
    paddingVertical: UI_CONSTANTS.SPACING.MD,
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
    minHeight: normalize(48),
  },
  large: {
    paddingVertical: UI_CONSTANTS.SPACING.LG,
    paddingHorizontal: UI_CONSTANTS.SPACING.XL,
    minHeight: normalize(56),
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: UI_CONSTANTS.COLORS.PRIMARY,
  },
  smallText: {
    fontSize: normalize(14),
  },
  mediumText: {
    fontSize: normalize(16),
  },
  largeText: {
    fontSize: normalize(18),
  },
  disabledText: {
    opacity: 0.7,
  },
});
