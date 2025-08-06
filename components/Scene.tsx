import { useEffect, useRef, useState, useMemo } from "react";
import { Grid, Text, MeshTransmissionMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import * as THREE from "three";
import gsap from "gsap";

import { SectionDetails, ModelShape } from "@/types";
import { Icon } from "@/components/Icon";
import { ArrowConnection } from './ArrowConnection';

import { connections } from './connections';
import sections from "@/components/data";
import { useSectionStore } from "@/store/sectionsStore";

export const Scene = () => {
    const {
        activeSectionIndex,
        // hoverSectionIndex,
        // setActiveSectionIndex,
        // setHoverSectionIndex,
    } = useSectionStore();

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
            <Pyramid
                sections={sections}
            />
            <Ground />
            <CameraController
                targetPosition={
                    activeSectionIndex !== Infinity && activeSectionIndex < sections.length
                        ? { x: -15, y: 15 }
                        : { x: 10, y: 10 }
                }
            />
            {sections.map((section, index) => (
                <Section
                    key={`section-model-${section.name}-${index}`}
                    section={section}
                    index={index}
                />
            ))}

            {activeSectionIndex !== Infinity &&
                connections.map((conn, i) => {
                    const from = modelLookup.get(conn.from);
                    const to = modelLookup.get(conn.to);
                    const isFromActive = conn.section === sections[activeSectionIndex]?.name;
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

interface CameraControllerProps {
    targetPosition: { x: number, y: number };
}

const CameraController: React.FC<CameraControllerProps> = ({ targetPosition }) => {
    const { controls } = useThree() as unknown as { controls: MapControls };

    useEffect(() => {
        if (!controls) return;

        const currentOffset = new THREE.Vector3().subVectors(
            controls.object.position,
            controls.target
        );

        const newTarget = new THREE.Vector3(targetPosition.x, 10, targetPosition.y);
        const newCamPos = newTarget.clone().add(currentOffset);

        gsap.to(controls.target, {
            ...newTarget,
            duration: 1,
            onUpdate: () => { controls.update() },
        });

        gsap.to(controls.object.position, {
            ...newCamPos,
            duration: 1,
            onUpdate: () => { controls.update() },
        });
    }, [targetPosition]);

    return null;
};

interface PyramidProps {
    sections: SectionDetails[];
}

const Pyramid: React.FC<PyramidProps> = ({ sections }) => {
    const {
        setActiveSectionIndex,
        setHoverSectionIndex,
        hoverSectionIndex,
    } = useSectionStore();

    const initialBottomWidth = 2;
    const heightPerLayer = 1;
    const groupRef = useRef<THREE.Group>(null);

    useEffect(() => {
        if (!groupRef.current) return;

        groupRef.current.traverse((child) => {
            if (child.name && child instanceof THREE.Mesh) {
                const originalY = child.userData.index * heightPerLayer;

                if (child.userData.index >= hoverSectionIndex && hoverSectionIndex !== Infinity) {
                    gsap.to(child.position, { y: originalY + heightPerLayer * 2 });
                    gsap.to(child.rotation, { y: Math.PI / 2 });
                } else if (child.userData.index <= hoverSectionIndex && hoverSectionIndex !== Infinity) {
                    gsap.to(child.position, { y: originalY });
                    gsap.to(child.rotation, { y: -Math.PI / 2 });
                } else {
                    gsap.to(child.position, { y: originalY });
                    gsap.to(child.rotation, { y: 0 });
                }
            }
        });
    }, [hoverSectionIndex]);

    return (
        <group ref={groupRef}>
            {sections.map((section, index) => {
                const geometry = useMemo(() => {
                    const bottomWidth = initialBottomWidth - (index * initialBottomWidth / sections.length);
                    const topWidth = initialBottomWidth - ((index + 1) * initialBottomWidth / sections.length);
                    return new THREE.CylinderGeometry(topWidth, bottomWidth, heightPerLayer, 4, 1);
                }, []);

                return (
                    <group
                        key={`pyramid-${section.name}-${index}`}
                        position={[2.5, heightPerLayer / 2, 2.5]}
                        rotation={[0, Math.PI / 4, 0]}
                    >
                        <mesh
                            position={[0, index * heightPerLayer, 0]}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHoverSectionIndex(index);
                            }}
                            onClick={() => setActiveSectionIndex(hoverSectionIndex)}
                            onPointerLeave={() => setHoverSectionIndex(Infinity)}
                            geometry={geometry}
                            visible={false}
                        />
                        <mesh
                            name={section.name}
                            position={[0, index * heightPerLayer, 0]}
                            userData={{ index }}
                            geometry={geometry}
                        >
                            <MeshTransmissionMaterial
                                reflectivity={0.0}
                                transmission={0.7}
                                thickness={0.3}
                                flatShading
                                color="#87CEFA"
                            />
                        </mesh>
                        <Icon src={section.icon} y={index * heightPerLayer} />
                    </group>
                );
            })}
        </group>
    );
};

interface SectionProps {
    section: SectionDetails;
    index: number;
}

const Section: React.FC<SectionProps> = ({ section, index }) => {
    const { activeSectionIndex, setActiveSectionIndex } = useSectionStore();
    const isActive = index === activeSectionIndex;

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
            scale={0.5}
            position={[-20, 0, 10]}
            onClick={() => setActiveSectionIndex(Infinity)}
        >
            <Text
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.01, 0]}
                color="white"
                fontSize={2}
            >
                {section.name}
            </Text>
            {section.models.map((model, i) => (
                <SectionModel model={model} key={`${section.name}-models-${i}`} />
            ))}
        </group>
    );
};

const SectionModel = ({ model }: { model: ModelShape }) => (
    <group>
        <mesh
            position={[model.position[0], model.size[1] / 2, model.position[2]]}
            scale={model.size}
            rotation={[0, model.shape === "cone" ? Math.PI / 4 : 0, 0]}
            castShadow
            receiveShadow
        >
            {model.shape === "box" ? (
                <boxGeometry args={[1, 1, 1]} />
            ) : model.shape === "cone" ? (
                <coneGeometry args={[1, 1, 4]} />
            ) : model.shape === "cylinder" ? (
                <cylinderGeometry />
            ) : null}
            <meshStandardMaterial color={model.color ?? "hotpink"} />
        </mesh>
        <Text
            rotation={[-Math.PI / 2, 0, 0]}
            position={[
                model.position[0] + (model.shape === "box" ? model.size[0] : model.size[0] * 2),
                0.01,
                model.position[2] + (model.shape === "box" ? model.size[2] : model.size[2] * 2),
            ]}
            fontSize={0.7}
            color="white"
        >
            {model.name}
        </Text>
    </group>
);

const Ground = () => (
    <>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
            <planeGeometry args={[100, 100, 1, 1]} />
            <meshStandardMaterial color="black" />
        </mesh>
        <Grid infiniteGrid position={[-10, 0, 0]} receiveShadow />
    </>
);
