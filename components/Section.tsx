import { SectionDetails, ModelShape } from "@/types";
import { useEffect, useState } from "react";
import { useSectionStore } from "@/store/sectionsStore";
import { Text, Html } from "@react-three/drei";
import * as THREE from "three";

interface SectionProps {
    section: SectionDetails;
    isActive: boolean;
    position?: [x: number, y: number, z: number]
    scale? : number;
    isSubsection: boolean;
}

export const Section: React.FC<SectionProps> = ({ 
        section,
        isActive,
        position = [-20, 0, 10],
        scale = 0.5,
        isSubsection = false 
    }) => {
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (isActive) {
            setShouldRender(true);
        } else {
            timeout = setTimeout(() => {
                setShouldRender(false);
            }, 500);
        }

        return () => clearTimeout(timeout);
    }, [isActive]);

    if (!shouldRender) return null;

    return (
        <group
            scale={scale}
            position={position}
        >
            {/* Section title background */}
            <mesh 
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, 0.1, 0]}
            >
                <planeGeometry args={[15, 2, 1, 1]} />
                <meshBasicMaterial color="#0E3386" />
                <Text
                    position={[0, 0.0, 0.1]}
                    color="white"
                    fontSize={2}
                >
                    {section.name}
                </Text>
            </mesh>

            {/* Render models */}
            {section.models.map((model, i) => (
                <SectionModel 
                    model={model} 
                    index={i}
                    key={`${section.name}-models-${i}`} 
                    isSubSection={isSubsection}
                />
            ))}
        </group>
    );
};

const SectionModel = ({ model, index, isSubSection = false } : 
    { model: ModelShape; index: number, isSubSection: boolean }) => {
    const { setCameraPosition, setActiveSubSectionIndex, setHoverSubSectionIndex, activeSubSectionIndex } = useSectionStore();

    const [hovered, setHovered] = useState(false);
    const [mousePos, setMousePos] = useState(new THREE.Vector3());

    return (
        <>
            <group>
                {/* Main model */}
                <mesh
                    position={[model.position[0], model.size[1] / 2, model.position[2]]}
                    scale={model.size}
                    rotation={[0, model.shape === "cone" ? Math.PI / 4 : 0, 0]}
                    castShadow
                    receiveShadow
                    onClick={() => {
                        !isSubSection && setActiveSubSectionIndex(index);
                        setCameraPosition({ x: -45, y: 15 });
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        setHoverSubSectionIndex(index);
                        setHovered(true);
                        document.body.style.cursor = "pointer";
                    }}
                    onPointerMove={(e) => {
                        setHoverSubSectionIndex(index);
                        setMousePos(e.object.position.clone().add({x: 2, y: 4, z: 0}));
                    }}
                    onPointerOut={(e) => {
                        setHoverSubSectionIndex(Infinity);
                        e.stopPropagation();
                        setHovered(false);
                        document.body.style.cursor = "default";
                    }}
                >
                    {model.shape === "box" && <boxGeometry />}
                    {model.shape === "cone" && <coneGeometry args={[1, 1, 4]} />}
                    {model.shape === "cylinder" && <cylinderGeometry />}
                    <meshStandardMaterial color={model.color ?? "hotpink"} />
                </mesh>

                {/* Model label */}
                <Text
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[
                        model.position[0] + model.size[0] * 1.2,
                        0.01,
                        model.position[2] + model.size[2] * 1.2,
                    ]}
                    fontSize={0.7}
                    color="white"
                >
                    {model.name}
                </Text>

                {model.subsection && (
                    <Section
                        scale={1}
                        position={[-60, 0, 0]}
                        section={model.subsection}
                        isActive={activeSubSectionIndex == index}
                        isSubsection={true}
                    />
                )}
            </group>

            {/* Tooltip */}
            {hovered && (
                <Html
                    position={mousePos}
                    style={{
                        background: "rgba(0,0,0,0.7)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                        fontSize: "14px",
                        transition: "opacity 5s",
                        opacity: hovered ? 1 : 0
                    }}
                >
                    {model.name}<br/>
                    {model.subsection && model.subsection.description}
                </Html>
            )}
        </>
    );
};
