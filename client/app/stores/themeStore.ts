import { create } from "zustand";
import { persist } from "zustand/middleware";
import { allThemes } from "../utils/themes";

type Theme = (typeof allThemes)[keyof typeof allThemes];

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: allThemes.original,
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-store",
    }
  )
);
