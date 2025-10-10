import { useState, useEffect } from "react";
import { Timer, Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DebateModule = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchImage = async () => {
      const { data } = supabase.storage
        .from('Thesis')
        .getPublicUrl('Modules/IG_4a.png');
      
      if (data?.publicUrl) {
        setImageUrl(data.publicUrl);
      }
    };
    
    fetchImage();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen bg-background p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-24 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-4xl font-semibold text-foreground">M6</span>
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-foreground mb-2">Burst the bubble</h1>
              <p className="text-muted-foreground text-lg mb-4">
                Switch sides, switch views and switch the way you think!
              </p>
              <div className="flex items-center gap-2 text-foreground">
                <Timer className="h-5 w-5" />
                <span className="text-xl font-medium">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="text-right min-w-[280px]">
            <Progress value={98} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Polarization Score</p>
            <p className="text-2xl font-semibold text-foreground">98%</p>
            <p className="text-lg text-muted-foreground mt-2">1/4 Left</p>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Image */}
          <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-medium)] border border-border w-fit mx-auto lg:mx-0">
            <div className="rounded-lg overflow-hidden" style={{ width: '407px', height: '648px' }}>
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="AI is an insult to life itself - Miyazaki's predictions come true" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-muted w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Loading image...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Scenario Details */}
          <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-medium)] border border-border w-fit mx-auto lg:mx-0" style={{ width: '407px', height: '648px' }}>
            <p className="text-sm font-medium text-muted-foreground mb-4">Scenario 1</p>
            
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              "AI is an insult to life itself."
            </h2>

            <p className="text-foreground mb-2">
              <span className="font-semibold">Hayao Miyazaki</span> — the legendary Japanese filmmaker once called AI "an insult to life itself."
            </p>

            <p className="font-semibold text-foreground mt-6 mb-2">For context:</p>
            <p className="text-foreground mb-6">
              During a 2016 documentary, after seeing an AI-generated animation that, to him, lacked humanity and soul. Nearly a decade later, AI-generated "Ghibli-style" art has gone viral — reviving the same question he raised back then.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">🧠 The Debate:</p>
              <p className="text-foreground font-medium">
                Was Miyazaki right to call AI an insult to life — or is it actually expanding what life can create?
              </p>
            </div>

            <p className="text-foreground font-medium mb-4">🔥 Ready to take a side?</p>

            <Button 
              size="lg" 
              className="w-full bg-muted hover:bg-muted/80 text-foreground font-medium"
              onClick={() => navigate('/debate/switch')}
            >
              Start Now
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DebateModule;
