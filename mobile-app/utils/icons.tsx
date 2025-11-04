/**
 * Icon wrapper components matching lucide-react icons from web app
 * Using Ionicons as the closest match for React Native
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

// Map lucide-react icons to Ionicons equivalents
export const Heart = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="heart" size={size} color={color} />
);

export const HeartOutline = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="heart-outline" size={size} color={color} />
);

export const BookOpen = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="book-outline" size={size} color={color} />
);

export const Users = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="people" size={size} color={color} />
);

export const HeartHandshake = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="heart-circle-outline" size={size} color={color} />
);

export const Library = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="library-outline" size={size} color={color} />
);

export const Gift = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="gift-outline" size={size} color={color} />
);

export const ArrowLeft = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="arrow-back" size={size} color={color} />
);

export const ArrowRight = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="arrow-forward" size={size} color={color} />
);

export const Crown = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="ribbon-outline" size={size} color={color} />
);

export const User = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="person" size={size} color={color} />
);

export const MapPin = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="location" size={size} color={color} />
);

export const Clock = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="time-outline" size={size} color={color} />
);

export const Star = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="star" size={size} color={color} />
);

export const Calendar = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="calendar-outline" size={size} color={color} />
);

export const ThumbsUp = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="thumbs-up-outline" size={size} color={color} />
);

export const MessageSquare = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="chatbox-outline" size={size} color={color} />
);

export const Send = ({ size = 24, color = '#000' }: IconProps) => (
  <Ionicons name="send" size={size} color={color} />
);

