import { create } from 'zustand';
import { storage } from '@/lib/utils';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const STORAGE_KEY = 'theme-mode';

// Get initial theme from localStorage or system preference
function getInitialTheme(): ThemeMode {
  const stored = storage.get<ThemeMode>(STORAGE_KEY, 'system');
  return stored;
}

// Apply theme to document
function applyTheme(mode: ThemeMode) {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (mode === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(mode);
  }
}

export const useThemeStore = create<ThemeStore>((set, get) => {
  // Initialize theme
  const initialMode = getInitialTheme();
  applyTheme(initialMode);

  // Listen to system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (get().mode === 'system') {
      applyTheme('system');
    }
  });

  return {
    mode: initialMode,

    setMode: (mode) => {
      set({ mode });
      storage.set(STORAGE_KEY, mode);
      applyTheme(mode);
    },

    toggleMode: () => {
      const current = get().mode;
      const next = current === 'light' ? 'dark' : 'light';
      get().setMode(next);
    },
  };
});
