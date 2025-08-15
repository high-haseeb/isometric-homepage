"use client";

import { useState, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    Handle,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    getBezierPath,
    BaseEdge, Edge, Node,
    EdgeLabelRenderer, Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import sections from "@/components/data"

const presetIcons = [
    "/icons/gear.png",
    "/icons/group.png",
    "/icons/package.png",
    "/icons/euro.png"
];

const shapes = ["box"];

export function buildNodesAndEdges() {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    sections.forEach((section, sectionIndex) => {
        // --- Create Section Node ---
        const offsetX = sectionIndex * 500 * sections.length;
        const sectionId = section.name;
        nodes.push({
            id: sectionId,
            type: "sectionNode",
            position: { x: offsetX, y: 0 },
            data: {
                name: section.name,
                description: section.description,
                icon: section.icon,
                onChangeName: () => {},
                onChangeDescription: () => {},
                onChangeIcon: () => {},
                onDelete: () => {},
            },
        });

        section.models.forEach((model, modelIndex) => {
            const modelId = model.name;

            // --- Create Model Node ---
            nodes.push({
                id: modelId,
                type: "modelNode",
                position: { x: offsetX + 400, y: modelIndex * 400 },
                data: {
                    name: model.name,
                    description: `Model in ${section.name}`,
                    color: model.color,
                    position: { x: model.position[0], y: model.position[1], z: model.position[2] },
                    scale: { x: model.size[0], y: model.size[1], z: model.size[2] },
                    shape: model.shape,
                    onChangeName: () => {},
                    onChangeDescription: () => {},
                    onChangeColor: () => {},
                    onChangePosition: () => {},
                    onChangeScale: () => {},
                    onChangeShape: () => {},
                    onDelete: () => {},
                },
            });

            // --- Edge: Section → Model ---
            edges.push({
                id: `edge-${sectionId}-${modelId}`,
                source: sectionId,
                target: modelId,
                type: "smoothstep",
                sourceHandle: "models",
                targetHandle: "parent",
            });

            // --- If model has a subsection ---
            if (model.subsection) {
                const subSectionId = model.subsection.name;

                // Create Subsection Node
                nodes.push({
                    id: subSectionId,
                    type: "sectionNode",
                    position: { x: offsetX + 800, y: modelIndex * 400 },
                    data: {
                        name: model.subsection.name,
                        description: model.subsection.description,
                        icon: model.subsection.icon,
                        onChangeName: () => {},
                        onChangeDescription: () => {},
                        onChangeIcon: () => {},
                        onDelete: () => {},
                    },
                });

                // Edge: Model → Subsection
                edges.push({
                    id: `edge-${modelId}-${subSectionId}`,
                    source: modelId,
                    target: subSectionId,
                    type: "smoothstep",
                    sourceHandle: "subsection",
                    targetHandle: "parent",
                });

                // --- Also add subsection's models ---
                model.subsection.models.forEach((subModel, subModelIndex) => {
                    const subModelId = subModel.name;

                    nodes.push({
                        id: subModelId,
                        type: "modelNode",
                        position: { x: (subModelIndex * 400) + (offsetX) + 1500, y: modelIndex * 400 },
                        data: {
                            name: subModel.name,
                            description: `Model in ${model.name}`,
                            color: subModel.color,
                            position: { x: subModel.position[0], y: subModel.position[1], z: subModel.position[2] },
                            scale: { x: subModel.size[0], y: subModel.size[1], z: subModel.size[2] },
                            shape: subModel.shape,
                            onChangeName: () => {},
                            onChangeDescription: () => {},
                            onChangeColor: () => {},
                            onChangePosition: () => {},
                            onChangeScale: () => {},
                            onChangeShape: () => {},
                            onDelete: () => {},
                        },
                    });

                    // Edge: Subsection → SubModel
                    edges.push({
                        id: `edge-${subSectionId}-${subModelId}`,
                        source: subSectionId,
                        target: subModelId,
                        type: "smoothstep",
                        sourceHandle: "models",
                        targetHandle: "parent",
                    });
                });
            }
        });
    });

    return { nodes, edges };
}

export const DiagramEditor = () => {
    const [nodes, setNodes] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);

    useEffect(() => {
        const { nodes, edges } = buildNodesAndEdges();
        setNodes(nodes);
        setEdges(edges);
    }, []);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );

    const onConnect = useCallback((params: any) => {
        if (params.sourceHandle === "connectionStart" && params.targetHandle === "connectionEnd") {
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        type: "labeledEdge",
                        label: "",
                        data: {
                            onLabelChange: (id: any, newLabel: any) =>
                                setEdges((cur) =>
                                    cur.map((e) => (e.id === id ? { ...e, label: newLabel } : e))
                                ),
                            onDelete: (id: any) =>
                                setEdges((cur) => cur.filter((e) => e.id !== id)),
                        },
                    },
                    eds
                )
            );
        } else {
            // Default edge
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        type: "default",
                    },
                    eds
                )
            );
        }
    }, []);


    // Remove node by ID
    const removeNode = (nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    };

    // Update node data
    const updateNodeData = (nodeId: string, key: string, value: any) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            [key]: value,
                            onChangeName: node.data.onChangeName,
                            onChangeDescription: node.data.onChangeDescription,
                            onChangeIcon: node.data.onChangeIcon,
                            onDelete: node.data.onDelete
                        }
                    }
                    : node
            )
        );
    };

    const buildModelShape = (modelNode: any, nodes: Node[], edges: Edge[]) => {
        // Find if this model has a subsection section connected
        const subsectionEdge = edges.find(
            (e) => e.source === modelNode.id && nodes.find(n => n.id === e.target)?.type === "sectionNode"
        );

        let subsection = undefined;
        if (subsectionEdge) {
            const sectionNode = nodes.find(n => n.id === subsectionEdge.target);
            subsection = buildSectionDetails(sectionNode, nodes, edges);
        }

        return {
            name: modelNode.data.name,
            description: modelNode.data.description,
            shape: modelNode.data.shape.toLowerCase(),
            size: [
                modelNode.data.scale.x,
                modelNode.data.scale.y,
                modelNode.data.scale.z
            ],
            position: [
                modelNode.data.position.x,
                modelNode.data.position.y,
                modelNode.data.position.z
            ],
            color: modelNode.data.color,
            ...(subsection ? { subsection } : {})
        };
    };

    const buildSectionDetails = (sectionNode: any, nodes: Node[], edges: Edge[]) => {
        const connectedModels: any[] = edges
        .filter((e) => e.source === sectionNode.id)
        .map((e) => nodes.find((n) => n.id === e.target))
        .filter((n) => n && n.type === "modelNode")
        .map((modelNode) => buildModelShape(modelNode, nodes, edges));

        return {
            name: sectionNode.data.name,
            description: sectionNode.data.description,
            icon: sectionNode.data.icon,
            models: connectedModels
        };
    };

    const downloadConfig = () => {
        // Sections that are not a subsection of any model
        const rootSections = nodes
        .filter(n => n.type === "sectionNode" && !edges.some(e => e.target === n.id && nodes.find(nd => nd.id === e.source)?.type === "modelNode"))
        .map(sectionNode => buildSectionDetails(sectionNode, nodes, edges));

        let connections = edges.filter((edge) => edge.type == "labeledEdge");
        connections = connections.map((connection) => { 
            const sourceNode = nodes.filter(node => node.id == connection.source)[0];
            const targetNode = nodes.filter(node => node.id == connection.target)[0];
            // console.log(sourceNode);
            return ({
                label: connection.label ?? "",
                // section: nodes.filter(node => node.),
                from: sourceNode.data.name,
                to:   targetNode.data.name,
                offset: 1,
            })
        }); 

        const output = {
            sections: rootSections,
            connections: connections
        };

        const jsonStr = JSON.stringify(output, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "sections-config.json";
        a.click();
        URL.revokeObjectURL(url);
    };


    const addModelNode = () => {
        const id = `model-node-${Date.now()}`;
        const newNode = {
            id,
            type: 'modelNode',
            position: { x: Math.random() * 300, y: Math.random() * 300 },
            data: {
                name: "New Model",
                description: "Description here...",
                color: "#ff0000",
                position: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
                shape: "box",
                onChangeName: () => {},
                onChangeDescription: () => {},
                onChangeColor: () => {},
                onChangePosition: () => {},
                onChangeScale: () => {},
                onChangeShape: () => {},
                onDelete: () => {}
            }
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const addSectionNode = () => {
        const id = `node-${Date.now()}`;
        const newNode = {
            id,
            type: 'sectionNode',
            position: { x: Math.random() * 300, y: Math.random() * 300 },
            data: {
                name: "New Section",
                description: "Description here...",
                icon: presetIcons[0],
                onChangeName: () => {},
                onChangeDescription: () => {},
                onChangeIcon: () => {},
                onDelete: () => {}
            }
        };
        setNodes((nds) => [...nds, newNode]);
    };

    // Inject handlers into nodes
    const nodesWithHandlers = nodes.map((node) => ({
        ...node,
        data: {
            ...node.data,
            onChangeName: (newName: string) => updateNodeData(node.id, "name", newName),
            onChangeDescription: (newDesc: string) => updateNodeData(node.id, "description", newDesc),
            onChangeIcon: (newIcon: string) => updateNodeData(node.id, "icon", newIcon),
            onChangeColor: (newColor: string) => updateNodeData(node.id, "color", newColor),
            onChangePosition: (newPos: any) => updateNodeData(node.id, "position", newPos),
            onChangeScale: (newScale: any) => updateNodeData(node.id, "scale", newScale),
            onChangeShape: (newShape: string) => updateNodeData(node.id, "shape", newShape),
            onDelete: () => removeNode(node.id)
        }
    }));

    const nodeTypes = { 
        sectionNode: SectionNode,
        modelNode: ModelNode,
    };

    const edgeTypes = {
        labeledEdge: LabeledEdge,
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Toolbar */}
            <div className="bg-gray-100 border-b px-4 py-2 flex gap-2 absolute bottom-10 left-1/2 -translate-x-1/2 rounded-lg z-50">
                <button
                    onClick={addModelNode}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    ➕ Add Model
                </button>
                <button
                    onClick={addSectionNode}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    ➕ Add Section
                </button>
                <button
                    onClick={downloadConfig}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    Download Config
                </button>
            </div>

            {/* Diagram Area */}
            <div className="flex-1">
                <ReactFlow
                    nodes={nodesWithHandlers}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    // @ts-ignore
                    edgeTypes={edgeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
};

const SectionNode = (props: any) => {
    return (
        <div className="bg-[#2a2a2a] text-white rounded-lg shadow-md w-max relative group border border-gray-700">
            {/* Delete button - only visible on hover */}
            <button
                onClick={props.data.onDelete}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow"
            >
                ✕
            </button>

            <div className="flex flex-col gap-0">
                {/* Header */}
                <div className="rounded-t-lg px-2 py-1 font-bold flex gap-2 items-center bg-orange-400 border-b border-gray-600">
                    <img
                        src={props.data.icon}
                        width={16}
                        height={16}
                        alt={props.data.name}
                        className=""
                    />
                    <input
                        type="text"
                        value={props.data.name}
                        onChange={(e) => props.data.onChangeName(e.target.value)}
                        className="bg-transparent text-white font-bold outline-none w-full"
                    />
                </div>

                {/* Icon dropdown */}
                <div className="flex items-center gap-2 px-2 py-1 bg-[#3a3a3a] border-b border-gray-600">
                    <select
                        value={props.data.icon}
                        onChange={(e) => props.data.onChangeIcon(e.target.value)}
                        className="px-1 rounded text-xs bg-[#3a3a3a] text-white border border-gray-600 outline-none"
                    >
                        {presetIcons.map((iconPath) => (
                            <option key={iconPath} value={iconPath}>
                                {iconPath.split("/").pop()?.replace(".png", "")}
                            </option>
                        ))}
                    </select>
                    <img
                        src={props.data.icon}
                        width={16}
                        height={16}
                        alt="icon preview"
                        className=""
                    />
                </div>

                {/* Description */}
                <textarea
                    value={props.data.description}
                    onChange={(e) => props.data.onChangeDescription(e.target.value)}
                    className="text-xs bg-[#3a3a3a] text-white w-full resize-none rounded-b px-2 py-1 outline-none border border-gray-600"
                    rows={3}
                />
            </div>

            {/* Handle */}
            <div className="relative flex items-center px-2 pb-2">
                <span className="text-xs text-right w-full">Models</span>
                <Handle type="source" position={Position.Right} id="models" />
            </div>

            <div className="relative flex items-center px-2 pb-2">
                <span className="text-xs text-left w-full">Parent</span>
                <Handle type="target" position={Position.Left} id="parent" />
            </div>
        </div>
    );
};

const ModelNode = (props: any) => {
    return (
        <div className="bg-[#2a2a2a] text-white rounded-lg shadow-md w-max relative group border border-gray-700">
            {/* Delete button */}
            <button
                onClick={props.data.onDelete}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow"
            >
                ✕
            </button>

            {/* Header */}
            <div
                className="rounded-t-lg px-2 py-1 font-bold flex items-center justify-between"
                style={{ backgroundColor: props.data.color }}
            >
                <input
                    type="text"
                    value={props.data.name}
                    onChange={(e) => props.data.onChangeName(e.target.value)}
                    className="bg-transparent text-white font-bold outline-none w-full"
                />
            </div>

            {/* Body */}
            <div className="p-2 flex flex-col gap-2">
                {/* Description */}
                <textarea
                    value={props.data.description}
                    onChange={(e) => props.data.onChangeDescription(e.target.value)}
                    className="text-xs bg-[#3a3a3a] text-white w-full resize-none rounded px-1 py-1 outline-none border border-gray-600"
                    rows={2}
                />

                {/* Color */}
                <div className="flex items-center gap-2">
                    <label className="text-xs w-12">Color:</label>
                    <input
                        type="color"
                        value={props.data.color}
                        onChange={(e) => props.data.onChangeColor(e.target.value)}
                        className="border border-gray-600 rounded"
                    />
                </div>

                {/* Position */}
                <div>
                    <label className="text-xs block mb-1">Position (x, y, z):</label>
                    <div className="flex gap-1">
                        {["x", "y", "z"].map((axis) => (
                            <input
                                key={axis}
                                type="number"
                                value={props.data.position[axis]}
                                onChange={(e) =>
                                    props.data.onChangePosition({
                                        ...props.data.position,
                                        [axis]: parseFloat(e.target.value)
                                    })
                                }
                                className="w-12 px-1 text-xs rounded bg-[#3a3a3a] text-white border border-gray-600 outline-none"
                            />
                        ))}
                    </div>
                </div>

                {/* Scale */}
                <div>
                    <label className="text-xs block mb-1">Scale (x, y, z):</label>
                    <div className="flex gap-1">
                        {["x", "y", "z"].map((axis) => (
                            <input
                                key={axis}
                                type="number"
                                step="0.1"
                                value={props.data.scale[axis]}
                                onChange={(e) =>
                                    props.data.onChangeScale({
                                        ...props.data.scale,
                                        [axis]: parseFloat(e.target.value)
                                    })
                                }
                                className="w-12 px-1 text-xs rounded bg-[#3a3a3a] text-white border border-gray-600 outline-none"
                            />
                        ))}
                    </div>
                </div>

                {/* Shape */}
                <div>
                    <label className="text-xs block mb-1">Shape:</label>
                    <select
                        value={props.data.shape}
                        onChange={(e) => props.data.onChangeShape(e.target.value)}
                        className="w-full px-1 text-xs rounded bg-[#3a3a3a] text-white border border-gray-600 outline-none"
                    >
                        {shapes.map((shape) => (
                            <option key={shape} value={shape}>
                                {shape}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Handle */}
            <div className="relative flex items-center px-2 pb-2">
                <span className="text-xs text-left w-full">Parent</span>
                <Handle type="target" position={Position.Left} id="parent" />
            </div>

            <div className="relative flex items-center px-2 pb-2">
                <span className="text-xs text-right w-full">SubSection</span>
                <Handle type="source" position={Position.Right} id="subsection" />
            </div>

            <div className="relative flex items-center px-2 pb-2">
                <span className="text-xs text-left w-full">Connection End</span>
                <Handle type="target" position={Position.Left} id="connectionEnd" />
            </div>

            <div className="relative flex items-center px-2 pb-2">
                <span className="text-xs text-right w-full">Connection Start</span>
                <Handle type="source" position={Position.Right} id="connectionStart" />
            </div>
        </div>
    );
};

const LabeledEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
    data
}: {
        id: string;
        sourceX: number;
        sourceY: number;
        targetX: number;
        targetY: number;
        sourcePosition: Position;
        targetPosition: Position;
        label?: string;
        data?: any;
    }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const [editValue, setEditValue] = useState(label || "");

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
        data?.onLabelChange?.(id, e.target.value);
    };

    const handleDelete = () => {
        data?.onDelete?.(id);
    };

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <EdgeLabelRenderer>
                <div
                    className="
                    absolute transform -translate-x-1/2 -translate-y-1/2
                    rounded-sm px-1 py-0.5
                    text-[10px] flex items-center gap-1 pointer-events-auto
                    group
                    "
                    style={{
                        left: `${labelX}px`,
                        top: `${labelY}px`
                    }}
                >
                    <input
                        type="text"
                        value={editValue}
                        onChange={handleLabelChange}
                        className="
                        w-max max-w-lg
                        bg-white px-1 py-0.5 border border-gray-300 rounded-sm
                        outline-none focus:border-blue-400 text-center text-sm
                        "
                    />
                    <button
                        onClick={handleDelete}
                        className="
                        bg-red-500 text-white rounded-full w-4 h-4 text-[9px]
                        flex items-center justify-center leading-none
                        opacity-0 group-hover:opacity-100 transition-opacity
                        "
                    >
                        ✕
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
};
