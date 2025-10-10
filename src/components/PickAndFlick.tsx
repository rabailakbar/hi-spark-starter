import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Heart, Bookmark, CheckCircle } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: number;
  title: string;
  source: string;
  views: string;
  timeAgo: string;
  liked: boolean;
  saved: boolean;
  commented: boolean;
  imageUrl?: string;
  width: number;
  displayHeight: number;
  type: "YTH" | "IG" | "YTT" | "IGR" | "TTR";
}

const PickAndFlick = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleId = searchParams.get("id") || "M2";
  const moduleName = searchParams.get("name") || "Pick & Flick";
  
  const [isComplete, setIsComplete] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  // Module 2 state - Static grid items
  const gridItems = [
    { id: 1, fileName: "IG Post_1c.png", width: 226, height: 361 },
    { id: 2, fileName: "IGR_3c.png", width: 224, height: 402 },
    { id: 3, fileName: "YT Headline_ 8b.png", width: 493, height: 130 },
    { id: 4, fileName: "YouTube Thumbnail_ 4a.png", width: 496, height: 248 },
    { id: 5, fileName: "IG_9b.png", width: 226, height: 356 },
    { id: 6, fileName: "IG_10a.png", width: 251, height: 399 },
    { id: 7, fileName: "YTT_6b.png", width: 494, height: 247 },
    { id: 8, fileName: "YTT_7a.png", width: 494, height: 247 },
    { id: 9, fileName: "YTH_R.png", width: 494, height: 130 },
    { id: 10, fileName: "IGR_8e.png", width: 228, height: 409 },
    { id: 11, fileName: "IG_4c.png", width: 227, height: 363 },
  ];

  const likesCount = posts.filter(p => p.liked).length;
  const savesCount = posts.filter(p => p.saved).length;
  const polarizationScore = Math.round((likesCount / 15) * 100);

  const handlePostAction = (id: number, action: "like" | "save" | "comment") => {
    setPosts(prev => {
      // Find if post exists
      const existingPost = prev.find(p => p.id === id);
      
      if (existingPost) {
        // Update existing post
        const updated = prev.map(post => {
          if (post.id === id) {
            if (action === "like") return { ...post, liked: !post.liked };
            if (action === "save") return { ...post, saved: !post.saved };
            if (action === "comment") return { ...post, commented: true };
          }
          return post;
        });
        
        const newLikes = updated.filter(p => p.liked).length;
        const newSaves = updated.filter(p => p.saved).length;
        
        if (newLikes >= 15 && newSaves >= 10) {
          setTimeout(() => setIsComplete(true), 500);
        }
        
        return updated;
      } else {
        // Create new post entry
        const gridItem = gridItems.find(g => g.id === id);
        const newPost: Post = {
          id,
          title: gridItem?.fileName || "",
          source: "",
          views: "",
          timeAgo: "",
          liked: action === "like",
          saved: action === "save",
          commented: action === "comment",
          width: gridItem?.width || 226,
          displayHeight: gridItem?.height || 360,
          type: "IG"
        };
        
        const updated = [...prev, newPost];
        const newLikes = updated.filter(p => p.liked).length;
        const newSaves = updated.filter(p => p.saved).length;
        
        if (newLikes >= 15 && newSaves >= 10) {
          setTimeout(() => setIsComplete(true), 500);
        }
        
        return updated;
      }
    });
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <div className="max-w-2xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-16 text-center">
          {/* Header with icon and title */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-semibold text-black">Module 2: Complete</h1>
              <p className="text-gray-700 text-sm mt-1">
                ✓ {likesCount}/15 Likes | {savesCount}/10 Saves
              </p>
            </div>
          </div>

          {/* Score section */}
          <div className="mt-10 mb-10">
            <p className="text-gray-700 mb-4">Your new score is</p>
            
            {/* Circular Progress Bar with gradient */}
            <div className="mx-auto w-32 h-32 relative mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Progress circle with gradient */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="314.16"
                  strokeDashoffset={314.16 - (314.16 * polarizationScore / 100)}
                  strokeLinecap="round"
                />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF5A5F" />
                    <stop offset="100%" stopColor="#8A2BE2" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-semibold text-gray-700">{polarizationScore}%</span>
              </div>
            </div>

            {/* Motivational message */}
            <p className="text-gray-600 text-sm leading-relaxed">
              You've outsmarted polarization and leveled up your perspective!<br />
              Your curiosity's flying. Good Job!
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base"
          >
            Back to Dashboard →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-6">
            <div className="text-6xl font-bold">
              M2
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-2">Pick & Flick</h1>
              <p className="text-2xl text-muted-foreground mb-3">
                Click to like and unlike!
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span className="text-lg">02:00</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <Progress value={polarizationScore} className="w-64 h-3 mb-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-2xl font-bold">{likesCount}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-end gap-3 mb-6 text-base">
          <span>{likesCount}/15 Likes</span>
          <span>{savesCount}/10 Saves</span>
          <span className="text-muted-foreground">Left only</span>
        </div>

        {/* Instructions */}
        <h2 className="text-xl mb-8">Click to like, save & comment</h2>

        {/* Custom Grid Layout */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '226px 496px 494px 228px',
            gap: '19px',
            gridAutoRows: 'min-content',
            maxWidth: 'fit-content',
            margin: '0 auto'
          }}
        >
          {gridItems.map((item, index) => {
            const post = posts.find(p => p.id === item.id) || {
              id: item.id,
              liked: false,
              saved: false,
              title: item.fileName,
              source: "",
              views: "",
              timeAgo: "",
              commented: false,
              width: item.width,
              displayHeight: item.height,
              type: "IG" as const
            };

            const gridStyles: React.CSSProperties = {
              width: `${item.width}px`,
              height: `${item.height}px`,
              borderRadius: '10px',
              border: '0.5px solid #D9D9D9',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              ...(index === 0 && { gridColumn: '1', gridRow: '1' }),
              ...(index === 1 && { gridColumn: '1', gridRow: '2 / 4' }),
              ...(index === 2 && { gridColumn: '2', gridRow: '1', marginBottom: '19px' }),
              ...(index === 3 && { gridColumn: '2', gridRow: '2', marginTop: '-10px', marginBottom: '19px' }),
              ...(index === 4 && { gridColumn: '2', gridRow: '3', marginTop: '-110px' }),
              ...(index === 5 && { gridColumn: '2', gridRow: '3', marginLeft: '254px', marginTop: '-110px' }),
              ...(index === 6 && { gridColumn: '3', gridRow: '1' }),
              ...(index === 7 && { gridColumn: '3', gridRow: '2', marginTop: '-120px' }),
              ...(index === 8 && { gridColumn: '3', gridRow: '3' }),
              ...(index === 9 && { gridColumn: '4', gridRow: '1 / 3' }),
              ...(index === 10 && { gridColumn: '4', gridRow: '3' }),
            };

            return (
              <div
                key={item.id}
                className="group"
                style={gridStyles}
              >
                <img 
                  src={`https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/${item.fileName}`}
                  alt={`Post ${item.id}`}
                  className="w-full h-full object-cover transition-all duration-200 group-hover:blur-[2px]"
                />
                
                {/* Overlay with buttons */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 px-2"
                >
                  <button
                    onClick={() => handlePostAction(item.id, 'like')}
                    className="flex items-center justify-center bg-background/90 backdrop-blur-sm border border-border rounded-full px-6 py-1 transition-all duration-200 hover:scale-105"
                  >
                    <Heart 
                      className={`w-5 h-5 ${post.liked ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
                    />
                  </button>
                  <button
                    onClick={() => handlePostAction(item.id, 'save')}
                    className="flex items-center justify-center bg-background/90 backdrop-blur-sm border border-border rounded-full px-6 py-1 transition-all duration-200 hover:scale-105"
                  >
                    <Bookmark 
                      className={`w-5 h-5 ${post.saved ? 'fill-primary text-primary' : 'text-foreground'}`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PickAndFlick;
