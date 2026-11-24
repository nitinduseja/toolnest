import { AnimationPreset } from './types';

export const ANIMATION_PRESETS: AnimationPreset[] = [
  {
    id: 'bounce',
    name: 'Gentle Bounce',
    config: {
      name: 'gentle-bounce',
      duration: 1,
      timingFunction: 'ease-in-out',
      iterationCount: 'infinite',
      direction: 'normal',
      fillMode: 'both',
    },
    keyframes: [
      { offset: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1 },
      { offset: 50, translateX: 0, translateY: -24, scale: 1.05, rotate: 0, opacity: 1 },
      { offset: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1 },
    ],
  },
  {
    id: 'pulse-glow',
    name: 'Pulse & Scale',
    config: {
      name: 'pulse-scale',
      duration: 1.5,
      timingFunction: 'ease-in-out',
      iterationCount: 'infinite',
      direction: 'alternate',
      fillMode: 'both',
    },
    keyframes: [
      { offset: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 0.8 },
      { offset: 100, translateX: 0, translateY: 0, scale: 1.15, rotate: 0, opacity: 1 },
    ],
  },
  {
    id: 'wobble-shake',
    name: 'Wobble Shake',
    config: {
      name: 'wobble-shake',
      duration: 0.8,
      timingFunction: 'ease',
      iterationCount: 'infinite',
      direction: 'normal',
      fillMode: 'both',
    },
    keyframes: [
      { offset: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1 },
      { offset: 25, translateX: -8, translateY: 0, scale: 1, rotate: -5, opacity: 1 },
      { offset: 75, translateX: 8, translateY: 0, scale: 1, rotate: 5, opacity: 1 },
      { offset: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1 },
    ],
  },
  {
    id: 'fade-slide',
    name: 'Fade & Slide Up',
    config: {
      name: 'fade-slide-up',
      duration: 0.6,
      timingFunction: 'ease-out',
      iterationCount: '1',
      direction: 'normal',
      fillMode: 'forwards',
    },
    keyframes: [
      { offset: 0, translateX: 0, translateY: 30, scale: 0.95, rotate: 0, opacity: 0 },
      { offset: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1 },
    ],
  },
];
