import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ThumbsUp, ThumbsDown, Heart, Bookmark } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Topic {
  id: number;
  category: string;
  title: string;
  voted: "interested" | "not-interested" | null;
}

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

const Interest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleId = searchParams.get("id") || "M1";
  const moduleName = searchParams.get("name") || "Pick & Flick";
  
  const [isComplete, setIsComplete] = useState(false);
  
  // Fetch images from Supabase storage
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage
        .from('Thesis')
        .list('Modules', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }

      if (data && data.length > 0) {
        // Get public URLs for all images
        const imagePromises = data.map(async (file, index) => {
          const { data: urlData } = supabase.storage
            .from('Thesis')
            .getPublicUrl(`Modules/${file.name}`);
          
          // Load image to get actual dimensions
          return new Promise<Post>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const fileName = file.name.toLowerCase();
              let type: "YTH" | "IG" | "YTT" | "IGR" | "TTR" = "IG";
              
              // Determine type based on filename
              if (fileName.includes('yth') || fileName.includes('yt headline')) {
                type = "YTH";
              } else if (fileName.includes('youtube thumbnail') || fileName.includes('ytt')) {
                type = "YTT";
              } else if (fileName.includes('igr')) {
                type = "IGR";
              } else if (fileName.includes('tt_') || fileName.includes('ttr')) {
                type = "TTR";
              } else if (fileName.includes('ig')) {
                type = "IG";
              }
              
              resolve({
                id: index + 1,
                title: file.name,
                source: "",
                views: "",
                timeAgo: "",
                liked: false,
                saved: false,
                commented: false,
                imageUrl: urlData.publicUrl,
                width: img.naturalWidth,
                displayHeight: img.naturalHeight,
                type
              });
            };
            img.onerror = () => {
              resolve({
                id: index + 1,
                title: file.name,
                source: "",
                views: "",
                timeAgo: "",
                liked: false,
                saved: false,
                commented: false,
                imageUrl: urlData.publicUrl,
                width: 226,
                displayHeight: 360,
                type: "IG"
              });
            };
            img.src = urlData.publicUrl;
          });
        });
        
        // Wait for all images to load and get their dimensions
        Promise.all(imagePromises).then(loadedPosts => {
          // Shuffle the posts for Pinterest-style mixed layout
          const shuffled = loadedPosts.sort(() => Math.random() - 0.5);
          setPosts(shuffled);
        });
      }
    };

    if (moduleId === "M2") {
      fetchImages();
    }
  }, [moduleId]);
  
  // Module 1 state
  const [topics, setTopics] = useState<Topic[]>([
    { id: 1, category: "Entertainment", title: "Celebrity Influence & Drama", voted: null },
    { id: 2, category: "Pop Culture", title: "Trends & Culture", voted: null },
    { id: 3, category: "Health", title: "Health & Diseases", voted: null },
    { id: 4, category: "Education", title: "Science & Research", voted: null },
    { id: 5, category: "Politics", title: "Political News & Debates", voted: null },
    { id: 6, category: "Sports", title: "Esports & Games", voted: null },
    { id: 7, category: "Technology", title: "AI & Innovations", voted: null },
    { id: 8, category: "Pop Culture", title: "Movie & Song Reviews", voted: null },
    { id: 9, category: "Lifestyle", title: "Fashion & Trends", voted: null },
  ]);

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

  const [posts, setPosts] = useState<Post[]>([]);

  const selectedCount = topics.filter(t => t.voted === "interested").length;
  const likesCount = posts.filter(p => p.liked).length;
  const savesCount = posts.filter(p => p.saved).length;
  const commentsCount = posts.filter(p => p.commented).length;
  const polarizationScore = Math.round((likesCount / 15) * 100);

  const handleVote = (id: number, vote: "interested" | "not-interested") => {
    setTopics(prev => {
      const updated = prev.map(topic => 
        topic.id === id ? { ...topic, voted: vote } : topic
      );
      const newCount = updated.filter(t => t.voted === "interested").length;
      if (newCount >= 7) {
        setTimeout(() => setIsComplete(true), 500);
      }
      return updated;
    });
  };

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
  const nextModule = moduleId === "M1" ? "M2" : "M3";
  const nextModuleName = moduleId === "M1" ? "myworld" : "Next Module";
  const nextPath =
    moduleId === "M1"
      ? `/exercise?id=${nextModule}&name=${nextModuleName}`
      : `/module?id=${nextModule}&name=${nextModuleName}&phase=Phase ii`;

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
      <div className="max-w-2xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-16 text-center">
        
        {/* Module Completion Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center mr-4">
            <Bookmark className="w-6 h-6 text-[#7C3AED]" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-semibold text-black">
              {`Module ${moduleId.replace("M", "")}: Complete`}
            </h1>
            <p className="text-gray-700 text-sm mt-1">
              ✓ 0/7 Score interests narrowed!
            </p>
          </div>
        </div>

        {/* Score Circle */}
        <div className="mt-10 mb-10">
          <p className="text-gray-700 mb-4">Your new score is</p>
          <div className="mx-auto w-32 h-32 rounded-full border-[10px] border-transparent bg-gradient-to-r from-purple-500 to-pink-500 p-[3px]">
            <div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
              –
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-sm">
            We’ll start calculating from the next module…
          </p>
        </div>

        {/* Next Module Button */}
        <Button
          size="lg"
          onClick={() => navigate(nextPath)}
          className="mt-6 px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base"
        >
          Next Module →
        </Button>
      </div>
    </div>
  );
}

  // Module 2: Social Media Feed
  if (moduleId === "M2") {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-6">
              <div className="text-6xl font-bold">
                {moduleId}
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2">myworld</h1>
                <p className="text-2xl text-muted-foreground mb-3">
                  We see you!
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">05:00</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <Progress value={polarizationScore} className="w-64 h-3 mb-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Polarization Score</span>
                  <span className="text-2xl font-bold">{polarizationScore}%</span>
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
  }

  // Module 1: Topic Voting - UPDATED UI
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F5F1E8' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header - Horizontal Layout */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            {/* Left side: Icon + Module Info */}
            <div className="flex items-center gap-4">
              {/* Puzzle Icon */}
              <div className="w-16 h-16 bg-cyan-400 rounded-lg flex items-center justify-center relative">
                <svg viewBox="0 0 64 64" className="w-12 h-12">
                  <path 
                    d="M 10 10 L 10 30 L 20 30 C 20 25 25 20 30 20 C 35 20 40 25 40 30 L 54 30 L 54 10 Z M 40 30 L 40 44 C 45 44 50 49 50 54 C 50 59 45 64 40 64 L 40 54 L 10 54 L 10 30 Z" 
                    fill="#06B6D4"
                  />
                  <text x="24" y="28" fill="white" fontSize="16" fontWeight="bold">M1</text>
                </svg>
              </div>
              
              {/* Module Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Find your vibe</h1>
                <p className="text-sm text-gray-600 mb-2">Let's help you build your feed!</p>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">02:00</span>
                </div>
              </div>
            </div>
            
            {/* Right side: Counter */}
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{selectedCount}/7</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <h2 className="text-center text-base text-gray-700 mb-6 font-medium">
          Click to narrow down your interests
        </h2>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Card key={topic.id} className="p-5 bg-white border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" 
                  style={{ 
                    backgroundColor: '#E9D5FF', 
                    color: '#7C3AED' 
                  }}>
                  {topic.category}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-4 text-gray-900 min-h-[2.5rem]">
                {topic.title}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant={topic.voted === "interested" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-sm"
                  onClick={() => handleVote(topic.id, "interested")}
                >
                  <ThumbsUp className="w-3.5 h-3.5 mr-1.5" />
                  Interested
                </Button>
                <Button
                  variant={topic.voted === "not-interested" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-sm"
                  onClick={() => handleVote(topic.id, "not-interested")}
                >
                  <ThumbsDown className="w-3.5 h-3.5 mr-1.5" />
                  Interested
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Interest;