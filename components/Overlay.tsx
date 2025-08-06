"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSectionStore } from "@/store/sectionsStore";
import { SectionDetails } from "@/types";
import sections from "@/components/data";

export const Overlay = () => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const { hoverSectionIndex } = useSectionStore();

    const section: SectionDetails | undefined =
        hoverSectionIndex !== Infinity ? sections[hoverSectionIndex] : undefined;

    useEffect(() => {
        if (!overlayRef.current) return;

        if (section) {
            gsap.to(overlayRef.current, {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
            });
        } else {
            gsap.to(overlayRef.current, {
                autoAlpha: 0,
                y: 20,
                duration: 0.5,
                ease: "power2.in",
            });
        }
    }, [section]);

    return (
        <div
            ref={overlayRef}
            className="fixed bottom-10 left-10 flex flex-col font-bold opacity-0 pointer-events-none z-50"
        >
            {section && (
                <>
                    <div className="text-5xl" style={{ color: "white" }}>
                        {section.name}
                    </div>
                    <div className="text-lg mt-2 max-w-md text-white font-normal">
                        {section.description}
                    </div>
                </>
            )}
        </div>
    );
};
