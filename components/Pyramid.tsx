import { useRef, useEffect, useMemo } from "react";
import { useSectionStore } from "@/store/sectionsStore";
import { Icon } from "@/components/Icon";
import * as THREE from "three";
import gsap from "gsap";

export const Pyramid = () => {
    const {
        setActiveSectionIndex,
        setHoverSectionIndex,
        hoverSectionIndex,
        sections, setCameraPosition
    } = useSectionStore();

    const initialBottomWidth = 2;
    const heightPerLayer = 1;
    const groupRef = useRef<THREE.Group>(null);
    const baseColor = new THREE.Color("#2080ff");
    const hoverColor = new THREE.Color("#1560bd");

    useEffect(() => {
        if (!groupRef.current) return;

        groupRef.current.traverse((child) => {
            if (child.name && child instanceof THREE.Mesh) {
                const originalY = child.userData.index * heightPerLayer;

                const offset = Math.max(1.0, (sections.length - hoverSectionIndex) * 0.45);
                if (child.userData.index >= hoverSectionIndex && hoverSectionIndex !== Infinity) {
                    gsap.to(child.position, { y: originalY + offset });
                    gsap.to(child.rotation, { y: Math.PI / 2 });
                } else if (child.userData.index <= hoverSectionIndex && hoverSectionIndex !== Infinity) {
                    gsap.to(child.position, { y: originalY });
                    gsap.to(child.rotation, { y: -Math.PI / 2 });
                } else {
                    gsap.to(child.position, { y: originalY });
                    gsap.to(child.rotation, { y: 0 });
                }
                if (hoverSectionIndex != Infinity) {
                    gsap.to(child.material.color, {
                        r: hoverColor.r,
                        g: hoverColor.g,
                        b: hoverColor.b,
                    });
                } else {
                    gsap.to(child.material.color, {
                        r: baseColor.r,
                        g: baseColor.g,
                        b: baseColor.b,
                    });
                }
            }
        });
    }, [hoverSectionIndex]);

    const geometries = useMemo(() => {
        return sections.map((_, index) => {
            const bottomWidth = initialBottomWidth - (index * initialBottomWidth / sections.length);
            const topWidth = initialBottomWidth - ((index + 1) * initialBottomWidth / sections.length);
            return new THREE.CylinderGeometry(topWidth, bottomWidth, heightPerLayer, 4, 1);
        });
    }, [sections, initialBottomWidth, heightPerLayer]);

    return (
        <group ref={groupRef}>
            {sections.map((section, index) => (
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
                            document.body.style.cursor = "pointer";
                        }}
                        onClick={() => { 
                            setActiveSectionIndex(hoverSectionIndex)
                            setCameraPosition({ x: -15, y: 15 });
                        }}
                        onPointerLeave={() => { 
                            setHoverSectionIndex(Infinity);
                            document.body.style.cursor = "default";
                        }}
                        geometry={geometries[index]}
                        visible={false}
                    />
                    <mesh
                        name={section.name}
                        position={[0, index * heightPerLayer, 0]}
                        userData={{ index }}
                        geometry={geometries[index]}
                    >
                        <meshPhysicalMaterial
                            reflectivity={1.0}
                            transmission={0.0}
                            thickness={0.3}
                            flatShading
                            color="#87CEFA"
                            transparent opacity={1.0}
                            depthWrite={hoverSectionIndex == Infinity ? false : true}
                            depthTest
                        />
                        <lineSegments>
                            <edgesGeometry args={[geometries[index]]} attach="geometry"/>
                            <lineBasicMaterial color="white" transparent opacity={0.2}/>
                        </lineSegments>
                    </mesh>
                    <Icon 
                        src={section.icon}
                        y={index * heightPerLayer - 0.25} 
                        active={hoverSectionIndex === index}
                    />
                </group>
            ))}
        </group>
    );
};
