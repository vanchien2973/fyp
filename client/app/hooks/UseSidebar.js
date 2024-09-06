import { create } from 'zustand';

export const UseSidebar = create((set) => ({
  isMinimized: false,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized }))
}));
