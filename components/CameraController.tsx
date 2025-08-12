import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import * as THREE from "three";
import { useSectionStore } from "@/store/sectionsStore";
import gsap from "gsap";

export const CameraController = () => {
    const { controls } = useThree() as unknown as { controls: MapControls };
    const { cameraPosition } = useSectionStore();

    useEffect(() => {
        if (!controls) return;

        const currentOffset = new THREE.Vector3().subVectors(
            controls.object.position,
            controls.target
        );

        const newTarget = new THREE.Vector3(cameraPosition.x, 10, cameraPosition.y);
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
    }, [cameraPosition]);

    return null;
};
