import { create } from 'zustand';
import { HomePageConfig, NavigationButton } from '@/types';
import { storage } from '@/lib/utils';

interface HomePageStore {
  // State
  config: HomePageConfig;
  editMode: boolean;
  selectedButtonId: string | null;

  // Actions
  addButton: (button: Omit<NavigationButton, 'id'>) => void;
  removeButton: (buttonId: string) => void;
  updateButton: (buttonId: string, updates: Partial<NavigationButton>) => void;
  updateButtonPosition: (buttonId: string, position: { x: number; y: number }) => void;
  setBackgroundImage: (imageUrl: string) => void;

  // UI Actions
  setEditMode: (editMode: boolean) => void;
  setSelectedButton: (buttonId: string | null) => void;

  // Storage Actions
  saveConfig: () => void;
  loadConfig: () => void;
  resetConfig: () => void;
}

const STORAGE_KEY = 'multi-dashboard-homepage';

// Default modern IIoT background (dark gradient with tech pattern)
const DEFAULT_BACKGROUND = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

const defaultConfig: HomePageConfig = {
  backgroundImage: DEFAULT_BACKGROUND,
  buttons: [],
};

export const useHomePageStore = create<HomePageStore>((set, get) => ({
  // Initial state
  config: defaultConfig,
  editMode: false,
  selectedButtonId: null,

  // Add navigation button
  addButton: (button) => {
    const newButton: NavigationButton = {
      ...button,
      id: `button-${Date.now()}`,
    };

    set((state) => ({
      config: {
        ...state.config,
        buttons: [...state.config.buttons, newButton],
      },
    }));

    get().saveConfig();
  },

  // Remove button
  removeButton: (buttonId) => {
    set((state) => ({
      config: {
        ...state.config,
        buttons: state.config.buttons.filter((b) => b.id !== buttonId),
      },
      selectedButtonId: state.selectedButtonId === buttonId ? null : state.selectedButtonId,
    }));

    get().saveConfig();
  },

  // Update button
  updateButton: (buttonId, updates) => {
    set((state) => ({
      config: {
        ...state.config,
        buttons: state.config.buttons.map((button) =>
          button.id === buttonId ? { ...button, ...updates } : button
        ),
      },
    }));

    get().saveConfig();
  },

  // Update button position
  updateButtonPosition: (buttonId, position) => {
    set((state) => ({
      config: {
        ...state.config,
        buttons: state.config.buttons.map((button) =>
          button.id === buttonId ? { ...button, position } : button
        ),
      },
    }));

    get().saveConfig();
  },

  // Set background image
  setBackgroundImage: (imageUrl) => {
    set((state) => ({
      config: {
        ...state.config,
        backgroundImage: imageUrl,
      },
    }));

    get().saveConfig();
  },

  // Set edit mode
  setEditMode: (editMode) => {
    set({ editMode });
  },

  // Set selected button
  setSelectedButton: (buttonId) => {
    set({ selectedButtonId: buttonId });
  },

  // Save to localStorage
  saveConfig: () => {
    const { config } = get();
    storage.set(STORAGE_KEY, config);
  },

  // Load from localStorage
  loadConfig: () => {
    const saved = storage.get<HomePageConfig>(STORAGE_KEY, defaultConfig);
    set({ config: saved });
  },

  // Reset to default
  resetConfig: () => {
    set({ config: defaultConfig });
    storage.remove(STORAGE_KEY);
  },
}));
