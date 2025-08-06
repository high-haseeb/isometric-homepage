import { useTexture } from "@react-three/drei";

export const Icon = ({ src, y }: { src: string, y: number }) => {
    const map = useTexture(src);
    return (
        <sprite position={[0, y, 0.01]} scale={0.4}
            renderOrder={100}
            // onClick={() => window.open("https://fmis.aalberts-kara.de/fmis-finanzen", '_blank')}
            onPointerOver={() => document.body.style.cursor = "pointer"}
            onPointerLeave={() => document.body.style.cursor = "default"}
        >
            <spriteMaterial map={map} color={"white"} transparent/>
        </sprite> 
    )
}
