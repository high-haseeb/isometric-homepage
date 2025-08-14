import { Grid } from "@react-three/drei";

export const Ground = () => (
    <>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[-25, -0.01, 0]}>
            <planeGeometry args={[100, 100, 1, 1]} />
            <meshStandardMaterial color="#000F2C" />
        </mesh>
        <Grid infiniteGrid position={[-25, 0, 0]} sectionThickness={1.0} cellThickness={0.1} />
    </>
);
