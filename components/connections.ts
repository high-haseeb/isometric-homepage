import { Connection } from "@/types";

export const connections = [
    { section: "Integration",  from: "App-5", to: "App-1", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-9", to: "App-5", color: "black", label: "outbound" },
    { section: "Integration", from: "App-10", to: "App-9", color: "black", label: "outbound" },
    { section: "Integration", from: "App-10", to: "App-1", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-6", to: "App-1", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-6", to: "App-5", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-6", to: "App-9", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-6", to: "App-10", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-6", to: "App-11", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-6", to: "App-2", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-6", to: "App-3", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-6", to: "App-4", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-6", to: "App-7", color: "black", label: "outbound" },
    { section: "Integration",  from: "App-7", to: "App-8", color: "black", label: "outbound" },
] as Connection[];
