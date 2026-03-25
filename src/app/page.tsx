import Navbar from "@/components/Navbar";
import ScriptInput from "@/components/ScriptInput";

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 lg:px-8 lg:py-6 animate-fade-in-up">
        <ScriptInput />
      </div>
    </div>
  );
}
