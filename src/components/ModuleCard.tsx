import { Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ModuleBadge from "./ModuleBadge";

interface Module {
  id: string;
  module_number: string;
  title: string;
  description: string;
  level: string;
  duration_minutes: number;
  max_score: number;
  video_url: string | null;
}

interface ModuleCardProps {
  module: Module;
}

const ModuleCard = ({ module }: ModuleCardProps) => {
  const navigate = useNavigate();

  return (
    // === OUTER WRAPPER ===
    <div className="flex min-h-[calc(100vh-40px)] w-full flex-col items-center justify-center bg-[#F8F1E7] rounded-3xl shadow-sm px-[12%] py-16 mx-8 my-8">
      {/* === MODULE CARD === */}
      <Card className="w-full max-w-3xl p-10 shadow-card border-none rounded-2xl bg-white flex flex-col space-y-8">
        
        {/* === HEADER === */}
        <div className="flex items-center gap-6">
          <ModuleBadge moduleNumber={module.module_number} />
          <div className="flex flex-col items-start">
            <h3 className="text-[#E76E50] font-semibold text-lg">Phase I</h3>
            <h1 className="text-3xl font-bold text-foreground">{module.title}</h1>
          </div>
        </div>

        {/* === VIDEO PLACEHOLDER === */}
        <div className="bg-[#F3F4F6] rounded-lg h-32 flex flex-col items-center justify-center text-center">
          <p className="text-foreground font-medium">Walkthrough Video</p>
          <p className="text-muted-foreground text-sm">(small screen recording)</p>
        </div>

        {/* === DESCRIPTION === */}
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto text-center">
          {module.description}
        </p>

        {/* === INFO + BUTTON ROW === */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-[#E9F1FF] px-3 py-1 rounded-full">
              <span className="text-[#5B7FFF] font-medium">
                {module.level || "Beginner Level"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {module.duration_minutes
                  ? `${String(Math.floor(module.duration_minutes / 60)).padStart(2, "0")}:${String(module.duration_minutes % 60).padStart(2, "0")}`
                  : "02:00"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Score is not being calculated in this module</span>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-[#A56DFF] hover:bg-[#9355FA] text-white px-8 rounded-xl"
            onClick={() => navigate(`/quiz?module=${module.id}`)}
          >
            Let’s begin
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ModuleCard;
