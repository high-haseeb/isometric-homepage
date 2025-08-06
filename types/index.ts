export interface Connection {
    section: string;
    from:    string;
    to:      string;
    color?:  string;
    label?:  string;
    offset?: number;
}

export interface ModelShape {
    shape: string; //"box" | "cone" | "cylinder";
    size: [x: number, y: number, z: number];
    position: [x: number, y: number, z: number];
    name: string;
    color: string;
};

export interface SectionDetails {
        name: string;
        description: string;
        primaryColor: string;
        targetPosition: { x: number; y: number; },
        icon: string;
        models: ModelShape[];
};

