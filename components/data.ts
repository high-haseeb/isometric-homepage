import { SectionDetails, ModelShape } from "@/types";

function randomInRange(min: number, max: number): number {
    return +(Math.random() * (max - min) + min).toFixed(2);
}

function generateModels(
    sectionName: string,
    count: number,
    baseColor: string,
    startX = 0,
    startZ = 0,
    enableSubSections = true,
    depth = 0
): ModelShape[] {
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

    const models: ModelShape[] = [];

    const cols = Math.ceil(Math.sqrt(count));
    const spacing = 7;

    for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;

        const size: [number, number, number] = [
            randomInRange(1.5, 2.5),
            randomInRange(1.5, 2.5),
            randomInRange(1.5, 2.5),
        ];

        const position: [number, number, number] = [
            startX + col * spacing,
            0,
            startZ + row * spacing,
        ];

        const color = colorPalette[i % colorPalette.length];

        let subsection: SectionDetails | undefined;

        if (enableSubSections && depth < 1) {
            subsection = {
                name: `${sectionName} Sub-${i + 1}`,
                description: `Subsection ${i + 1} of ${sectionName}`,
                icon: "/icons/subsection.png",
                models: generateModels(`${sectionName} Sub-${i + 1}`, 5, color, -15, -15, false, depth + 1),
            };
        }

        models.push({
            shape: "box",
            size,
            position,
            name: `${sectionName}-${i + 1}`,
            color,
            subsection,
        });
    }

    return models;
}

const sections: SectionDetails[] = [
    {
        name: "Business",
        description: "Business operations and strategic processes",
        primaryColor: "#FF6B6B",
        targetPosition: { x: -40, y: 40 },
        icon: "/icons/euro.png",
        models: generateModels("Business", 10, "#FFA500", -20, -20, true),
    },
    {
        name: "Application",
        description: "Core software systems and platforms",
        primaryColor: "#4ECDC4",
        targetPosition: { x: 40, y: 40 },
        icon: "/icons/package.png",
        models: generateModels("Application", 10, "#4ECDC4", -20, -20),
    },
    {
        name: "Integration",
        description: "Connectivity and middleware components",
        primaryColor: "#FFA500",
        targetPosition: { x: -40, y: -40 },
        icon: "/icons/gear.png",
        models: generateModels("App", 11, "#FFA500", -20, -20),
    },
    {
        name: "Data",
        description: "Data storage, processing and pipelines",
        primaryColor: "#6A4C93",
        targetPosition: { x: 20, y: -40 },
        icon: "/icons/package.png",
        models: generateModels("Data", 10, "#6A4C93", -20, -20),
    },
    {
        name: "Infrastructure",
        description: "Physical and virtual IT infrastructure",
        primaryColor: "#1A535C",
        targetPosition: { x: 30, y: -10 },
        icon: "/icons/group.png",
        models: generateModels("Infrastructure", 12, "#1A535C", -20, -20),
    },
].reverse();

export default sections;
