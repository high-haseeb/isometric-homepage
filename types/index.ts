export interface Connection {
    section: string;
    from:    string;
    to:      string;
    color?:  string;
    label?:  string;
    offset?: number;
}

export interface ModelShape {
    subsection?: SectionDetails;
    description?: string;
    shape: string; //"box" | "cone" | "cylinder";
    size: [x: number, y: number, z: number];
    position: [x: number, y: number, z: number];
    name: string;
    color: string;
};

export interface SectionDetails {
        name: string;
        description: string;
        icon: string;
        models: ModelShape[];
};

