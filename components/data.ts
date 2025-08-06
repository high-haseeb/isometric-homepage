import { SectionDetails } from "@/types";

function randomInRange(min: number, max: number): number {
    return +(Math.random() * (max - min) + min).toFixed(2);
}

function generateModels(
    sectionName: string,
    count: number,
    baseColor: string,
    startX = 0,
    startZ = 0
) {
    const colorPalette = [
        baseColor,
        "#FFD166",
        "#06D6A0",
        "#EF476F",
        "#118AB2",
        "#8338EC",
        "#FF006E",
        "#3A86FF",
        "#FB5607",
        "#FFBE0B",
        "#00F5D4",
    ];

    const models = [];

    const cols = Math.ceil(Math.sqrt(count));
    const spacing = 7;

    for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;

        const size  = [
            randomInRange(1.5, 2.5),
            randomInRange(1.5, 2.5),
            randomInRange(1.5, 2.5),
        ] as [x: number, y: number, z: number];

        const position = [
            startX + col * spacing,
            0,
            startZ + row * spacing,
        ] as  [x: number, y: number, z: number];

        const color = colorPalette[i % colorPalette.length];

        models.push({
            shape: "box",
            size,
            position,
            name: `${sectionName}-${i + 1}`,
            color,
        });
    }

    return models;
}

const sections: SectionDetails[] = [
    {
        name: "Business",
        description: "Business operations and strategic processes",
        primaryColor: "#FF6B6B",
        icon: "/icons/gear.svg",
        targetPosition: { x: -40, y: 40 },
        models: generateModels("Business", 10, "#FFA500", -20, -20),
    },
    {
        name: "Application",
        description: "Core software systems and platforms",
        primaryColor: "#4ECDC4",
        icon: "/icons/gear.svg",
        targetPosition: { x: 40, y: 40 },
        models: generateModels("App-", 10, "#4ECDC4", -20, -20),
    },
    {
        name: "Integration",
        description: "Connectivity and middleware components",
        primaryColor: "#FFA500",
        icon: "/icons/gear.svg",
        targetPosition: { x: -40, y: -40 },
        models: generateModels("App", 11, "#FFA500", -20, -20),
    },
    {
        name: "Data",
        description: "Data storage, processing and pipelines",
        primaryColor: "#6A4C93",
        icon: "/icons/gear.svg",
        targetPosition: { x: 20, y: -40 },
        models: generateModels("Data", 10, "#6A4C93", -20, -20),
    },
    {
        name: "Infrastructure",
        description: "Physical and virtual IT infrastructure",
        primaryColor: "#1A535C",
        icon: "/icons/gear.svg",
        targetPosition: { x: 30, y: -10 },
        models: generateModels("Infra", 12, "#1A535C", -20, -20),
    },
].reverse();
export default sections;
