import { Connection } from "@/types";

export const connections = [
  { section: "Integration",  from: "App-5", to: "App-1", color: "black", label: "hello" },
  { section: "Integration",  from: "App-9", to: "App-5", color: "black", label: "hello" },
  { section: "Integration", from: "App-10", to: "App-9", color: "black", label: "hello" },
  { section: "Integration", from: "App-10", to: "App-1", color: "black", label: "hello" },
] as Connection[];
