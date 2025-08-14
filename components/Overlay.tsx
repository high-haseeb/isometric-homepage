"use client";

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { useSectionStore } from "@/store/sectionsStore";

export const Overlay = () => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const {
        hoverSectionIndex,
        hoverSubSectionIndex,
        sections,
        activeSectionIndex,
        activeSubSectionIndex,
        setActiveSectionIndex,
        setActiveSubSectionIndex,
        setCameraPosition
    } = useSectionStore();

    // Compute what to show
    const hoveredItem = useMemo(() => {
        // Show subsection details if hovering over one
        if (
            //hoverSectionIndex !== Infinity &&
            hoverSubSectionIndex !== Infinity && activeSectionIndex > 0 &&
            sections[activeSectionIndex]?.models[activeSubSectionIndex]?.subsection
        ) {
            return sections[activeSectionIndex].models[activeSubSectionIndex].subsection.models[hoverSubSectionIndex];
        } else if (
            activeSectionIndex !== Infinity && hoverSubSectionIndex > 0 &&
            sections[activeSectionIndex]?.models[hoverSubSectionIndex]?.subsection
        ) {
            return sections[activeSectionIndex].models[hoverSubSectionIndex].subsection;
        }

        // Otherwise, show main section details
        if (hoverSectionIndex !== Infinity) {
            return sections[hoverSectionIndex];
        }

        return undefined;
    }, [hoverSectionIndex, hoverSubSectionIndex, sections]);

    useEffect(() => {
        if (!overlayRef.current) return;

        if (hoveredItem) {
            // Animate in
            gsap.fromTo(
                overlayRef.current,
                {
                    autoAlpha: 0,
                    y: -50,
                    rotateX: -90,
                    transformOrigin: "top center",
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                }
            );
        } else {
            // Animate out
            gsap.to(overlayRef.current, {
                autoAlpha: 0,
                y: 50,
                rotateX: 90,
                transformOrigin: "top center",
                duration: 0.5,
                ease: "back.in(1.7)",
            });
        }
    }, [hoveredItem]);

    return (
        <>
            {/* Breadcrumb */}
            <div className="fixed top-10 left-10 z-50 font-bold text-white text-2xl flex gap-2">
                {activeSectionIndex !== Infinity && activeSectionIndex < sections.length && (
                    <>
                        <span 
                            onClick={() => {
                                setActiveSectionIndex(Infinity);
                                setActiveSubSectionIndex(-1);
                                setCameraPosition({ x: 10, y: 10 });
                            }}
                            className="cursor-pointer hover:underline"
                        >
                            Landscape Layer
                        </span>
                        <span> / </span>
                        <span
                            onClick={() => {
                                setActiveSubSectionIndex(-1);
                                setCameraPosition({ x: -15, y: 15 });
                            }}
                            className="cursor-pointer hover:underline"
                        >
                            {sections[activeSectionIndex].name}
                        </span>

                        {activeSubSectionIndex > 0 && (
                            <>
                                <span>/</span>
                                <span
                                    //onClick={() => {
                                    //    setActiveSubSectionIndex(-1);
                                    //    setCameraPosition({ x: -15, y: 15 });
                                    //}}
                                    className="cursor-pointer hover:underline"
                                >
                                    {sections[activeSectionIndex].models[activeSubSectionIndex]?.subsection?.name ?? ""}
                                </span>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Hover overlay */}
            <div
                ref={overlayRef}
                className="fixed bottom-10 left-10 flex flex-col font-bold opacity-0 pointer-events-none z-50"
            >
                {hoveredItem && (
                    <>
                        <div className="text-5xl" style={{ color: "white" }}>
                            {hoveredItem.name}
                        </div>
                        <div className="text-lg mt-2 max-w-md text-white font-normal">
                            {hoveredItem.description}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
