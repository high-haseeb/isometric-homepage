import * as THREE from 'three';
import { useMemo } from 'react';
import { Line, Html } from '@react-three/drei';
import { ArrowHelper } from 'three';

export const ArrowConnection = ({
    from,
    to,
    color = 'white',
    label = ' ',
    arrowLength = 1,
    arrowHeadLength = 0.3,
    arrowHeadWidth = 0.2,
    offset = 1,
}: {
        from: THREE.Vector3;
        to: THREE.Vector3;
        color?: string;
        label?: string;
        arrowLength?: number;
        arrowHeadLength?: number;
        arrowHeadWidth?: number;
        offset?: number;
    }) => {

    const { dir, adjustedFrom, adjustedTo, midPoint } = useMemo(() => {
        const fullDir = new THREE.Vector3().subVectors(to, from);
        const normalizedDir = fullDir.clone().normalize();
        const adjustedFrom = from.clone().add(normalizedDir.clone().multiplyScalar(offset));
        const adjustedTo = to.clone().add(normalizedDir.clone().multiplyScalar(-offset));
        const midPoint = adjustedFrom.clone().add(adjustedTo).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(adjustedTo, adjustedFrom).normalize();
        return { dir, adjustedFrom, adjustedTo, midPoint };
    }, [from, to, offset]);

    const arrowLengthActual = adjustedFrom.distanceTo(adjustedTo);

    return (
        <>
            <Line
                points={[adjustedFrom.toArray(), adjustedTo.toArray()]}
                color={"white"}
                lineWidth={2}
            />
            <primitive
                object={new ArrowHelper(dir, adjustedFrom, arrowLengthActual, "white", arrowHeadLength, arrowHeadWidth)}
            />
            {label && (
                <Html position={midPoint.toArray()} center style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'white',
                        color: 'black',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        border: `1px solid ${color}`
                    }}>
                        {label}
                    </div>
                </Html>
            )}
        </>
    );
};
