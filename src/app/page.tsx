import Navbar from "@/components/Navbar";
import ScriptInput from "@/components/ScriptInput";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <ScriptInput />
    </div>
  );
}
