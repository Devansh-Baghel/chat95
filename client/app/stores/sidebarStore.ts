import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppViewStore {
  showSidebar: boolean;
  showTopbar: boolean;
  setShowSidebar: (value: boolean) => void;
  setShowTopbar: (value: boolean) => void;
}

export const useAppViewStore = create<AppViewStore>()(
  persist(
    (set) => ({
      showSidebar: true,
      setShowSidebar: (value) => set({ showSidebar: value }),
      showTopbar: true,
      setShowTopbar: (value) => set({ showTopbar: value }),
    }),
    { name: "app-view-store" }
  )
);
