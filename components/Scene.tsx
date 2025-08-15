import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { SectionDetails, ModelShape } from "@/types";
import { ArrowConnection } from './ArrowConnection';
import { CameraController } from "@/components/CameraController";
import { Section } from "@/components/Section";
import { Ground } from "@/components/Ground";
import { Pyramid } from "@/components/Pyramid";
import { useSectionStore } from "@/store/sectionsStore";

export const Scene = () => {
    const { 
        activeSectionIndex,
       sections, setSections,
        connections, setConnections
    } = useSectionStore();

    useEffect(() => {
        fetch("/config.json")
        .then((res) => res.json())
        .then((data) => {
                setConnections(data.connections);
                setSections(data.sections);
            })
        .catch((err) => console.error('Failed to load config:', err));
    }, []);

    const modelLookup = useMemo(() => {
        const map = new Map<string, THREE.Vector3>();
        sections.forEach((section: SectionDetails) => {
            section.models.forEach((model: ModelShape) => {
                const pos = new THREE.Vector3(
                    -40 + model.position[0],
                    model.size[1] / 2,
                    20 + model.position[2]
                );
                map.set(model.name, pos);
            });
        });
        return map;
    }, [sections]);

    return (
        <group>
            <Pyramid />
            <Ground />
            <CameraController />

            {sections.map((section, index) => (
                <Section
                    key={`section-model-${section.name}-${index}`}
                    section={section}
                    isActive={activeSectionIndex == index}
                    isSubsection={false}
                />
            ))}

            {activeSectionIndex !== Infinity &&
                connections.map((conn, i) => {
                    const from = modelLookup.get(conn.from);
                    const to = modelLookup.get(conn.to);
                    //const isFromActive = conn.section === sections[activeSectionIndex]?.name;
                    const isFromActive = sections[activeSectionIndex].models.filter(model => model.name == conn.from).length > 0;
                    if (!from || !to || !isFromActive) return null;

                    const scale = 0.5;
                    const scaledFrom = from.clone().multiplyScalar(scale);
                    const scaledTo = to.clone().multiplyScalar(scale);

                    return (
                        <ArrowConnection
                            key={`conn-${i}`}
                            from={scaledFrom}
                            to={scaledTo}
                            color={conn.color}
                            label={conn.label}
                            offset={conn.offset}
                        />
                    );
                })}
        </group>
    );
};

