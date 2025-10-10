import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Clock, BookOpen, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const Module = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const moduleId = searchParams.get("id") || "M1";
  const moduleName = searchParams.get("name") || "Pick & Flick";
  const phase = searchParams.get("phase") || "Phase I";

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => navigate("/dashboard"), 200);
  };

  // Module-specific content
  const getModuleContent = () => {
    switch (moduleId) {
      case "M3":
        return {
          description:
            "In this module, students compare different types of content to identify what is fake. They will interact with four formats: two-post comparisons, three-post comparisons, TikTok vs Instagram reels, and carousel posts. To detect fake content, students must evaluate details such as the source, date and time, possible AI-generated or photoshopped images, advertisements, and engagement counts.",
          level: "Mid Level",
          time: "15 min",
          scoreInfo: "Score is calculated in this module",
        };
      default:
        return {
          description:
            "In this module, students will filter out content for themselves, from a pool of 50 topics, they are supposed to find the content into buckets of 'interested' or 'not interested'. These picks will shape their personal newsfeed for the new module.",
          level: "Beginner Level",
          time: "10 min",
          scoreInfo: "Score is not being calculated in this module",
        };
    }
  };

  const moduleContent = getModuleContent();

  return (
    <div className="flex min-h-[calc(100vh-40px)] w-full flex-col items-center justify-center bg-[#F8F1E7] rounded-3xl shadow-sm px-[12%] py-16 mx-8 my-8">
      

      {/* Centered Modal */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl w-full bg-transparent border-none shadow-none z-30 p-0">
          <Card className="w-full p-10 shadow-card border-none rounded-2xl bg-white flex flex-col space-y-8 relative z-40">
            {/* === HEADER === */}
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 flex items-center justify-center bg-[#E9F1FF] rounded-full text-[#5B7FFF] text-2xl font-semibold">
                {moduleId}
              </div>
              <div className="flex flex-col items-start">
                <h3 className="text-[#E76E50] font-semibold text-lg">{phase}</h3>
                <h1 className="text-3xl font-bold text-foreground">{moduleName}</h1>
              </div>
            </div>

            {/* === VIDEO PLACEHOLDER === */}
            <div className="bg-[#F3F4F6] rounded-lg h-32 flex flex-col items-center justify-center text-center">
              <p className="text-foreground font-medium">Walkthrough Video</p>
              <p className="text-muted-foreground text-sm">(small screen recording)</p>
            </div>

            {/* === DESCRIPTION === */}
            <p className="text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto text-center">
              {moduleContent.description}
            </p>

            {/* === INFO + BUTTON ROW === */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-6 flex-wrap justify-center">
                <div className="flex items-center gap-2 bg-[#E9F1FF] px-3 py-1 rounded-full">
                  <BookOpen className="w-4 h-4 text-[#5B7FFF]" />
                  <span className="text-[#5B7FFF] font-medium">{moduleContent.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{moduleContent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>{moduleContent.scoreInfo}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-[#A56DFF] hover:bg-[#9355FA] text-white px-8 rounded-xl"
                onClick={() =>
                  navigate(`/exercise?id=${moduleId}&name=${moduleName}`)
                }
              >
                Let’s begin
              </Button>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Module;
