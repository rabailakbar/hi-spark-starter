import { Bookmark, Clock, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
interface ModuleCardProps {
  phase: string;
  moduleNumber: string;
  title: string;
  description: string;
  difficulty: string;
  hasTimer?: boolean;
  hasScoring?: boolean;
  onStart?: () => void;
}
export const ModuleCard = ({
  phase,
  moduleNumber,
  title,
  description,
  difficulty,
  hasTimer = true,
  hasScoring = true,
  onStart
}: ModuleCardProps) => {
  return <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-medium)] border border-border">
        {/* Header with badge and title */}
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            <div className="w-20 h-24 bg-muted rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-2xl font-semibold text-foreground">{moduleNumber}</span>
            </div>
            
          </div>
          
          <div className="flex-1 pt-2">
            <p className="text-sm font-medium text-muted-foreground mb-1">{phase}</p>
            <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
          </div>
        </div>

        {/* Video placeholder */}
        <div className="bg-[hsl(var(--video-placeholder))] rounded-xl h-[280px] flex items-center justify-center mb-6">
          <div className="text-center">
            <p className="text-foreground font-medium mb-1">Walkthrough Video</p>
            <p className="text-sm text-muted-foreground">(small screen recording)</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-foreground leading-relaxed mb-6">
          {description}
        </p>

        {/* Footer with metadata and button */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="secondary" className="bg-[hsl(var(--badge-bg))] text-[hsl(var(--badge-difficulty))] hover:bg-[hsl(var(--badge-bg))] font-medium px-3 py-1.5">
              <Award className="h-4 w-4 mr-1.5" />
              {difficulty}
            </Badge>
            
            {hasTimer && <Badge variant="secondary" className="bg-[hsl(var(--badge-bg))] text-[hsl(var(--badge-difficulty))] hover:bg-[hsl(var(--badge-bg))] font-medium px-3 py-1.5">
                <Clock className="h-4 w-4 mr-1.5" />
                Time
              </Badge>}
            
            {hasScoring && <Badge variant="secondary" className="bg-[hsl(var(--badge-bg))] text-[hsl(var(--badge-difficulty))] hover:bg-[hsl(var(--badge-bg))] font-medium px-3 py-1.5">
                <TrendingUp className="h-4 w-4 mr-1.5" />
                Score is calculated in this module
              </Badge>}
          </div>

          <Button onClick={onStart} size="lg" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium px-8 transition-all duration-200">
            Click here to start
          </Button>
        </div>
      </div>
    </div>;
};