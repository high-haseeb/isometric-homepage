import { Experience } from "@/components/Experience";
import { Overlay } from "@/components/Overlay";

export default function Home() {

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#181818]">
            <div className="w-full h-full">
                <Experience />
            </div>
            <Overlay/>
        </div>
    );
}
