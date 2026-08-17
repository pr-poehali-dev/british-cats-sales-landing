declare global {
  interface Window {
    ym?: (counterId: number, action: string, target: string, params?: Record<string, unknown>) => void;
  }
}

const YM_COUNTER_ID = 103597090;

export const ymGoal = (target: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    window.ym(YM_COUNTER_ID, 'reachGoal', target, params);
  }
};
