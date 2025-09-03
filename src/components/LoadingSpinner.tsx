import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { UI_CONSTANTS } from '../constants';
import { normalize } from '../utils/normalize';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = UI_CONSTANTS.COLORS.PRIMARY,
  text,
  fullScreen = false,
}) => {
  const containerStyle = fullScreen ? styles.fullScreen : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: UI_CONSTANTS.SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI_CONSTANTS.COLORS.BACKGROUND,
  },
  text: {
    marginTop: UI_CONSTANTS.SPACING.MD,
    fontSize: normalize(16),
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});
