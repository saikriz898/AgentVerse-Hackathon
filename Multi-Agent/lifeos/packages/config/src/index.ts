/**
 * LifeOS Design System Tokens & Brand Constants ("Quiet Luxury")
 */

export const LIFEOS_BRAND = {
  name: 'LifeOS',
  tagline: 'Autonomous AI Operating System',
  version: '1.0.0',
  borderRadius: '18px', // Fixed 18px radius per Quiet Luxury mandate
} as const;

export const LIFEOS_COLORS = {
  light: {
    background: '#FAFAF8',
    surface: '#FFFFFF',
    secondarySurface: '#F4F4F2',
    border: '#E7E5E4',
    primaryText: '#111827',
    secondaryText: '#4B5563',
    mutedText: '#9CA3AF',
    primaryAccent: '#1F6F5F',
    accentHover: '#19594D',
    accentPressed: '#15463D',
    lightAccent: '#E7F5F1',
    success: '#2D6A4F',
    warning: '#C0841A',
    error: '#C0392B',
  },
  dark: {
    background: '#0F1115',
    surface: '#17191E',
    secondarySurface: '#1F232A',
    border: '#2D333B',
    primaryText: '#F8FAFC',
    secondaryText: '#CBD5E1',
    mutedText: '#94A3B8',
    accent: '#4FA38A',
    accentHover: '#3F8671',
    accentPressed: '#336B5A',
    lightAccent: '#19342C',
    success: '#388E3C',
    warning: '#F57C00',
    error: '#D32F2F',
  },
} as const;

export const LIFEOS_ANIMATION = {
  durationFast: '180ms',
  durationNormal: '230ms',
  durationSlow: '280ms',
  timingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth ease-out, no bounce
} as const;
