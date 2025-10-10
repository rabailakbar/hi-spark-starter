import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SocialPost from "@/components/SocialPost";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SocialPostPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const samplePosts = [
    {
      id: 1,
      username: "news_insider",
      isVerified: true,
      imageUrl: "https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/IG Post_1c.png",
      caption: "Breaking: Major scientific breakthrough announced today!",
      likes: "2.3K",
      comments: "156",
      shares: "89",
      timestamp: "2h",
      description: "This post appears to be from a verified news source with high engagement."
    },
    {
      id: 2,
      username: "random_user_123",
      isVerified: false,
      imageUrl: "https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/IG_9b.png",
      caption: "You won't believe what happened! Click to find out more...",
      likes: "45",
      comments: "12",
      shares: "3",
      timestamp: "5h",
      description: "This post uses clickbait language and has low engagement."
    },
    {
      id: 3,
      username: "science_facts",
      isVerified: true,
      imageUrl: "https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/YTT_6b.png",
      caption: "New research shows promising results in renewable energy",
      likes: "1.8K",
      comments: "234",
      shares: "156",
      timestamp: "1d",
      description: "Educational content from a verified science account."
    }
  ];

  const handlePostClick = (postId: number) => {
    setSelectedPost(postId);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedPost(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Social Media Analysis</h1>
              <p className="text-muted-foreground">Click on posts to analyze their credibility</p>
            </div>
          </div>
          {showResult && (
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePosts.map((post) => (
            <SocialPost
              key={post.id}
              username={post.username}
              isVerified={post.isVerified}
              imageUrl={post.imageUrl}
              caption={post.caption}
              likes={post.likes}
              comments={post.comments}
              shares={post.shares}
              timestamp={post.timestamp}
              description={post.description}
              onClick={() => handlePostClick(post.id)}
              isSelected={selectedPost === post.id}
              showResult={showResult && selectedPost === post.id}
              isCorrect={post.isVerified}
            />
          ))}
        </div>

        {/* Analysis Result */}
        {showResult && selectedPost && (
          <div className="mt-8 p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Analysis Result</h3>
            <p className="text-muted-foreground">
              {samplePosts.find(p => p.id === selectedPost)?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPostPage;
