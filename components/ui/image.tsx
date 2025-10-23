/**
 * NativeWind-compatible Image component using expo-image
 * 
 * This wraps expo-image to support className prop via cssInterop
 */

import { Image as ExpoImage, ImageProps } from 'expo-image';
import { styled } from 'nativewind';

// Create NativeWind-compatible Image with className support
export const Image = styled(ExpoImage, {
  className: 'style',
});

// Type-safe export with className added
export type { ImageProps };

