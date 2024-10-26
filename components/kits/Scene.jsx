"use client";
import { useStateStore } from "@/stores/kits/store";
import { Environment, useProgress, Html, Line } from "@react-three/drei";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import React, { Suspense, useMemo, useEffect, useRef } from "react";
import Ground from "@/components/kits/Ground";
import { Instances as BagInstances, Model } from "@/components/kits/BagStand";
import { StackyInstances, Stacky } from "@/components/kits/BasePlanter";
import { Feeder } from "./Feeder";
import { Vector3 } from "three";
import { Controls } from "./Controls";
import { lerp } from "three/src/math/MathUtils";

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center className="font-bold text-6xl w-screen flex items-center justify-center text-brGreen">
            {progress.toFixed(0)}% loaded
        </Html>
    );
}

const Scene = () => {
    const { garden } = useStateStore();

    return (
        <div className="lg:flex-grow lg:w-4/5 w-full z-0 h-3/4  ">
            <Canvas camera={{ position: [100, 10, 0], zoom: 5 }}>
                <Suspense fallback={<Loader />}>
                    {/* <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 3} /> */}
                    <Controls />
                    <group position={[0, 0, -2]}>
                        <Plants />
                        <Ground />
                        {garden.length > 0 && <Nutrient />}
                    </group>

                    <Environment files={["/forest_slope_1k.hdr"]} />
                    <directionalLight />

                    <CameraAdjuster />
                </Suspense>
            </Canvas>
        </div>
    );
};


const CameraAdjuster = () => {
    const { camera, size } = useThree();
    const { stacksPerTower } = useStateStore();
    const breakPoint = 768;
    useFrame(() => {
        if (stacksPerTower > 5) {
            if(size.width <= breakPoint){
                camera.zoom = lerp(camera.zoom, 3.2, 0.1);
            }else{
                camera.zoom = lerp(camera.zoom, 5, 0.1);
            }
        } else {
            if(size.width <= breakPoint){
                camera.zoom = lerp(camera.zoom, 3.2, 0.1);
            }else{
                camera.zoom = lerp(camera.zoom, 8, 0.1);
            }
        }
        camera.updateProjectionMatrix()
    })

    useEffect(() => {
        const handleResize = () => {
            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();
        };
        if (size.width <= breakPoint) {
            camera.zoom = 3;
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [camera, size]);

    return null;
};

const PAD = 4;
const Nutrient = () => {
    const { nutrient, COLS, stacksPerTower, height } = useStateStore();
    const h = stacksPerTower - 1;

    const points = [
        [0, 1.1, -2.0], [0, 1.1, -(2 * PAD + 2) / 2 - 1],
        [0, 1.1, -(2 * PAD + 2) / 2 - 1], [0, h, -(2 * PAD + 2) / 2 - 1],
        [0, h, -(2 * PAD + 2) / 2 - 1], [0, h, -(2 * PAD + 2)]

    ]
    const {size} = useThree();
    let lineWidth = 5;
    const breakPoint = 768;
    if(size.width <= breakPoint){
        lineWidth = 3;
    }else{
        lineWidth = 5;
    }
    return (
        <>
            <Feeder position={[-PAD, 4, (height * 0.75) / 2 + 4]} full={nutrient !== "organic"} scale={1} />
            <Line points={points} color="black" lineWidth={lineWidth} position={[-PAD, 4, (COLS / 2) * PAD + 2 * PAD]} />
        </>
    );
};
const Plants = () => {
    const { garden, ROWS, COLS, baseColor, stacksPerTower, setActive, riserPipe, midTowerRiser, showDimensions, maxQuantity, width, height } = useStateStore();

    const MAX_PLANTS = COLS * ROWS;
    const gridLines = [];
    const xOffset = (PAD * ROWS) / 2;
    const yOffset = (PAD * COLS) / 2;
    const {size} = useThree();

    let lineWidth = 5;
    const breakPoint = 768;
    if(size.width <= breakPoint){
        lineWidth = 3;
    }

    if (garden.length !== 0) {
        for (let row = 1; row <= Math.min(ROWS, Math.ceil(maxQuantity / COLS)); row++) {
            for (let index = 1; index < Math.min(COLS, maxQuantity - (row - 1) * COLS); index++) {
                gridLines.push([
                    [row * PAD - xOffset - PAD / 2, 0, (COLS - index) * PAD - (yOffset - PAD / 2)],
                    [row * PAD - xOffset - PAD / 2, 0, (COLS - index + 1) * PAD - (yOffset - PAD / 2) - 2 * PAD],
                ]);
            }
            if (row > 1 && row <= 2) {
                gridLines.push([
                    [0, 0, yOffset - PAD / 2],
                    [-PAD, 0, yOffset - PAD / 2],
                ]);
            }
            if (row > 2) {
                gridLines.push([
                    [-PAD, 0, yOffset - PAD / 2],
                    [PAD, 0, yOffset - PAD / 2],
                ]);
            }
        }
    }
    const stacksPerTowerArray = useMemo(() => new Array(stacksPerTower).fill(0), [stacksPerTower]);

    const calculatePosition = (index) => {
        const x = Math.floor(index / COLS) * PAD - xOffset + PAD / 2;
        const y = (-index % COLS) * PAD + yOffset - PAD / 2;
        return { x, y };
    };
    const riserPipeOffset = 3;
    return (
        <>
            <StackyInstances>
                <BagInstances>
                    {garden.slice(0, Math.min(maxQuantity, MAX_PLANTS)).map((planter, gardenIndex) => {
                        const { x, y } = calculatePosition(gardenIndex);

                        return (
                            <group key={`planter-${gardenIndex}`} onClick={() => setActive(gardenIndex)}>
                                {stacksPerTowerArray.map((_, stackIndex) => {
                                    const height = 2 + Math.floor(stackIndex / (stacksPerTower / (midTowerRiser + 1))) * riserPipe;
                                    return (
                                        <Stacky
                                            key={`stacky-${gardenIndex}-${stackIndex}`}
                                            position={[x, stackIndex + height, y]}
                                            scale={0.4}
                                            rotation={[0, stackIndex % 2 === 0 ? Math.PI / 4 : 0, 0]}
                                            color={planter.color}
                                        />
                                    );
                                })}
                                {/* pipe */}
                                <mesh position={[x, (stacksPerTower + midTowerRiser * riserPipe + riserPipeOffset) / 2, y]}>
                                    <cylinderGeometry args={[0.1, 0.1, stacksPerTower + midTowerRiser * riserPipe + riserPipeOffset]} />
                                    <meshBasicMaterial color={"black"} />
                                </mesh>
                                {/* base */}
                                {planter.trolley === "bag" ? (
                                    <Model position={[x - 3.0, -0.1, y - 2.1]} scale={1.5} key={`base-${gardenIndex}`} />
                                ) : (
                                    <Stacky position={[x, 0.3, y]} scale={0.4} color={baseColor} key={`base-${gardenIndex}`} />
                                )}
                            </group>
                        );
                    })}
                </BagInstances>
            </StackyInstances>

            {garden.length > 0 && showDimensions && (
                <group>
                    <DimensionArrow
                        start={new Vector3(ROWS * PAD, 0, -((COLS * 5.5) * 0.75) / 2)}
                        end={new Vector3(ROWS * PAD, 0, ((COLS * 5.5) * 0.75) / 2)}
                        measurement={`${height}ft`}
                        axis="x"
                    />

                    <DimensionArrow
                        start={new Vector3(-(ROWS * 5.5) * 0.75 / 2, 0, (-COLS * PAD) * 0.75)}
                        end={new Vector3((ROWS * 5.5) * 0.75 / 2, 0, (-COLS * PAD) * 0.75)}
                        measurement={`${width}ft`}
                        axis="y"
                    />

                    <DimensionArrow
                        start={new Vector3(Math.min(ROWS, Math.ceil(maxQuantity / COLS)) * 2.3 - 2.0, 0, -PAD + ((COLS - 1) * PAD) / 2)}
                        end={new Vector3(Math.min(ROWS, Math.ceil(maxQuantity / COLS)) * 2.3 - 2.0, 0, ((COLS - 1) * PAD) / 2)}
                        measurement={`1m`}
                        axis="x"
                    />

                    {(Math.min(ROWS, Math.ceil(maxQuantity / COLS)) > 1) ? (
                        <DimensionArrow
                            start={new Vector3(Math.min(ROWS, Math.ceil(maxQuantity / COLS)) === 2 ? -PAD : 0, 0, (COLS * PAD) / 2)}
                            end={new Vector3(Math.min(ROWS, Math.ceil(maxQuantity / COLS)) === 2 ? 0 : PAD, 0, (COLS * PAD) / 2)}
                            measurement={`1.5m`}
                            axis="y"
                        />
                    ) : null}
                </group>
            )}

            {garden.length > 0 &&
                gridLines.map((line, index) => (
                    <Line
                        key={`line-${index}`}
                        points={line}
                        color="black"
                        lineWidth={lineWidth}
                        position={[0, stacksPerTower + midTowerRiser * riserPipe + riserPipeOffset, 0]}
                    />
                ))}
        </>
    );
};
const DimensionArrow = ({ start, end, measurement, axis }) => {
    const origin = end.clone().add(start).divideScalar(2);

    const {size} = useThree();

    let lineWidth = 5;
    const breakPoint = 768;
    if(size.width <= breakPoint){
        lineWidth = 3;
    }else{
        lineWidth = 5;
    }

    return (
        <group>
            <Line
                points={[[start.x, start.y, start.z], [end.x, end.y, end.z]]}
                color="black"
                transparent
                opacity={0.5}
                lineWidth={lineWidth}
            />
            <mesh position={start} rotation={axis === "x" ? [-Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0, 0.3, 0.7]} />
                <meshBasicMaterial color={"black"} transparent opacity={0.5} />
            </mesh>
            <mesh position={end} rotation={axis === "x" ? [Math.PI / 2, 0, 0] : [0, 0, -Math.PI / 2]}>
                <cylinderGeometry args={[0, 0.3, 0.7]} />
                <meshBasicMaterial color={"black"} transparent opacity={0.5} />
            </mesh>

            <Html position={origin} center>
                <div className="bg-gray-700 rounded-xl px-4 lg:py-2 py-1 text-white text-xs bg-opacity-50">{measurement}</div>
            </Html>
        </group>
    );
};
export default Scene;
