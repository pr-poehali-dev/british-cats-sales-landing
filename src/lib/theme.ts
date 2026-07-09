import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light' | 'colorful';

export const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: 'dark', label: 'Тёмная', icon: 'Moon' },
  { id: 'light', label: 'Светлая', icon: 'Sun' },
  { id: 'colorful', label: 'Разноцветная', icon: 'Palette' },
];

const KEY = 'khakni-theme';
const listeners = new Set<() => void>();

function getTheme(): Theme {
  const t = localStorage.getItem(KEY) as Theme | null;
  return t === 'light' || t === 'colorful' || t === 'dark' ? t : 'dark';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('theme-light', 'theme-colorful');
  if (theme === 'light') root.classList.add('theme-light');
  if (theme === 'colorful') root.classList.add('theme-colorful');
}

export function setTheme(theme: Theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => 'dark');
}

applyTheme(getTheme());
