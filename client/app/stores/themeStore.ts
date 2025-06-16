import { create } from "zustand";
import { allThemes } from "../utils/themes";

type ThemeName = keyof typeof allThemes;

interface ThemeStore {
  theme: any;
  setTheme: (theme: any) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: allThemes.original,
  setTheme: (theme) => set({ theme }),
}));
