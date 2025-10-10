import { Bookmark } from "lucide-react";

interface ModuleBadgeProps {
  moduleNumber: string;
}

const ModuleBadge = ({ moduleNumber }: ModuleBadgeProps) => {
  return (
    <div className="relative w-16 h-20 flex items-center justify-center">
      <Bookmark className="w-16 h-20 text-badge fill-badge" />
      <span className="absolute inset-0 flex items-center justify-center text-badge-foreground font-bold text-lg pt-1">
        M5
      </span>
    </div>
  );
};

export default ModuleBadge;
