import { create } from "zustand";
import { SectionDetails, Connection } from "@/types";

interface SectionState {
    activeSectionIndex: number;
    activeSubSectionIndex: number;
    hoverSectionIndex: number;
    hoverSubSectionIndex: number;
    setActiveSectionIndex: (index: number) => void;
    setActiveSubSectionIndex: (index: number) => void;
    setHoverSectionIndex: (index: number) => void;
    setHoverSubSectionIndex: (index: number) => void;

    cameraPosition: { x: number, y: number };
    setCameraPosition: (position: { x: number, y: number }) => void;

    sections: SectionDetails[];
    setSections: (sections: SectionDetails[]) => void;
    connections: Connection[];
    setConnections: (connections: Connection[]) => void;
}

export const useSectionStore = create<SectionState>((set) => ({
    sections: [],
    connections: [],
    setConnections: (connections) => set({ connections }),
    setSections: (sections) => set({ sections }),
    cameraPosition: { x: 10, y: 10 },
    setCameraPosition: (cameraPosition) => set({ cameraPosition }),
    activeSubSectionIndex: -1,
    setActiveSubSectionIndex: (activeSubSectionIndex) => set({ activeSubSectionIndex }),

    activeSectionIndex: Infinity,
    hoverSectionIndex: Infinity,
    hoverSubSectionIndex: Infinity,
    setHoverSubSectionIndex: (index) => set({ hoverSubSectionIndex: index }),
    setActiveSectionIndex: (index) => set({ activeSectionIndex: index }),
    setHoverSectionIndex: (index) => set({ hoverSectionIndex: index }),
}));
