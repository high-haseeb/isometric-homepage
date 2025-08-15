import { DiagramEditor } from "@/components/DiagramEditor";

const ConfigGeneratorPage = () => {
    return (
        <main className="w-full h-[100dvh] bg-[#181818] text-black overflow-hidden">
            <div className="font-bold text-3xl absolute top-10 left-10 text-white">Config Generator</div>
            <DiagramEditor/>
        </main>
    )
}

export default ConfigGeneratorPage;
