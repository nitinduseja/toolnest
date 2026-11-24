export interface KeyframePoint {
  offset: number; // 0 to 100
  translateX: number; // in px
  translateY: number; // in px
  scale: number; // 0.1 to 3
  rotate: number; // -360 to 360 deg
  opacity: number; // 0 to 1
}

export interface AnimationConfig {
  name: string;
  duration: number; // in seconds
  timingFunction: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
  cubicBezier?: string;
  iterationCount: 'infinite' | '1' | '2' | '3';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface AnimationPreset {
  id: string;
  name: string;
  config: AnimationConfig;
  keyframes: KeyframePoint[];
}
