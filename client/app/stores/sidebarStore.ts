import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      setIsOpen: (value) => set({ isOpen: value }),
    }),
    { name: "sidebar-store" }
  )
);
