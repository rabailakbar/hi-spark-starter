import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, BadgeCheck, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SocialPostProps {
  username: string;
  isVerified?: boolean;
  imageUrl: string;
  caption: string;
  likes: string;
  comments: string;
  shares: string;
  timestamp: string;
  description: string;
  onClick?: () => void;
  isSelected?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
}

const SocialPost = ({
  username,
  isVerified,
  imageUrl,
  caption,
  likes,
  comments,
  shares,
  timestamp,
  description,
  onClick,
  isSelected,
  showResult,
  isCorrect
}: SocialPostProps) => {
  return (
    <Card 
      className={cn(
        "w-[358px] h-[570px] p-4 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105",
        isSelected && "ring-2 ring-primary",
        showResult && "animate-scale-in"
      )}
      onClick={onClick}
    >
      <div className="space-y-3 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-full" />
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">{username}</span>
              {isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />}
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Image */}
        <div className="relative flex-1 rounded-lg overflow-hidden bg-muted">
          <img src={imageUrl} alt={caption} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white text-sm font-medium">{caption}</p>
          </div>
          
          {/* Result Overlay */}
          {showResult && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in">
              {isCorrect ? (
                <CheckCircle className="w-24 h-24 text-[#4EBD6F] fill-[#4EBD6F] animate-scale-in" strokeWidth={1.5} />
              ) : (
                <XCircle className="w-24 h-24 text-[#B21B1D] fill-[#B21B1D] animate-scale-in" strokeWidth={1.5} />
              )}
            </div>
          )}
        </div>

        {/* Engagement */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span>{shares}</span>
          </div>
          <div className="ml-auto">
            <Bookmark className="w-4 h-4" />
          </div>
        </div>

        {/* Description */}
        <div className="text-xs space-y-1">
          <p className="line-clamp-2">
            <span className="font-semibold">{username}</span> {description}
          </p>
          <p className="text-muted-foreground">{timestamp}</p>
        </div>
      </div>
    </Card>
  );
};

export default SocialPost;
