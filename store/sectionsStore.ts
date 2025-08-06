import { create } from 'zustand';

interface SectionState {
  activeSectionIndex: number;
  hoverSectionIndex: number;
  setActiveSectionIndex: (index: number) => void;
  setHoverSectionIndex: (index: number) => void;
}

export const useSectionStore = create<SectionState>((set) => ({
  activeSectionIndex: Infinity,
  hoverSectionIndex: Infinity,
  setActiveSectionIndex: (index) => set({ activeSectionIndex: index }),
  setHoverSectionIndex: (index) => set({ hoverSectionIndex: index }),
}));
