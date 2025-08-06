"use client";

import { Environment, MapControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

export const Experience = () => {

    return (
        <Canvas className="w-full h-full" 
            orthographic camera={{ zoom: 100, position: [10, 10, 10] }}
            shadows
        >
            <ambientLight intensity={0.3} />
            <directionalLight
                castShadow
                position={[10, 10, 5]}
                intensity={1.5}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            <Scene />
            <MapControls position0={[10, 10, 10]} enableRotate={false} makeDefault />

            <Environment environmentIntensity={1.0} frames={Infinity} preset="city"/>
        </Canvas>
    );
};
