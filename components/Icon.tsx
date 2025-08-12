import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export const Icon = ({ src, y, active }: { src: string, y: number, active: boolean }) => {
    const map = useTexture(src);
    const iconRef = useRef<THREE.Sprite>(null);
    const targetScale = 0.5;
    // const hoverColor = new THREE.Color("#2080ff");
    useEffect(() => {
        if (!iconRef.current) return;
        if (active) {
            gsap.to(iconRef.current.scale, {
                x: targetScale, y: targetScale, z: targetScale
            });
            // gsap.to(iconRef.current.material.color, {
            //     r: hoverColor.r, g: hoverColor.g, b: hoverColor.b });
        } else {
            gsap.to(iconRef.current.scale, {
                x: 0.4, y: 0.4, z: 0.4
            });
            // gsap.to(iconRef.current.material.color, {
            //     r: 1, g: 1, b: 1 });
        }
    }, [active, iconRef.current]);

    return (
        <sprite position={[0, y, 0.01]} scale={0.4}
            ref={iconRef}
            renderOrder={active ? 99999 : 1}
            onPointerOver={() => document.body.style.cursor = "pointer"}
            onPointerLeave={() => document.body.style.cursor = "default"}
        >
            <spriteMaterial map={map} color={"white"} transparent 
            depthTest={!active} depthWrite={false}/>
        </sprite> 
    )
}
