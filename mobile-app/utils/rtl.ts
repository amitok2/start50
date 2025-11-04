import { I18nManager, ViewStyle, TextStyle } from 'react-native';

/**
 * RTL (Right-to-Left) utilities for Hebrew text support
 */

export const isRTL = I18nManager.isRTL;

/**
 * Get the appropriate text alignment for RTL
 */
export const getTextAlign = (defaultAlign: 'left' | 'center' | 'right' = 'left') => {
  if (defaultAlign === 'center') return 'center';
  return isRTL ? 'right' : 'left';
};

/**
 * Get the appropriate flex direction for RTL
 */
export const getFlexDirection = (defaultDirection: 'row' | 'row-reverse' = 'row') => {
  if (defaultDirection === 'row' && isRTL) return 'row-reverse';
  if (defaultDirection === 'row-reverse' && isRTL) return 'row';
  return defaultDirection;
};

/**
 * Get the appropriate position for RTL (e.g., left becomes right in RTL)
 */
export const getPosition = (position: 'left' | 'right') => {
  if (!isRTL) return position;
  return position === 'left' ? 'right' : 'left';
};

/**
 * Transform value for RTL (multiply by -1 in RTL for translateX, etc.)
 */
export const transformRTL = (value: number) => {
  return isRTL ? -value : value;
};

/**
 * Common RTL text style - use this for all Hebrew text
 */
export const rtlText: TextStyle = {
  textAlign: 'right',
  writingDirection: 'rtl',
};

/**
 * Common RTL view style for containers with text
 */
export const rtlView: ViewStyle = {
  alignItems: 'flex-end',
};

/**
 * RTL row style - reverses flex direction for rows
 */
export const rtlRow: ViewStyle = {
  flexDirection: 'row-reverse',
};

