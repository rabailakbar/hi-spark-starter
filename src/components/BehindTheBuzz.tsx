import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, ArrowRight, CheckCircle, RotateCcw } from "lucide-react";

interface PostData {
  id: number;
  type: "instagram" | "youtube";
  imageUrl: string;
  headline: string;
  source?: string; // For YouTube
  views?: string; // For YouTube
  timeAgo: string;
  likes?: string; // For Instagram
  comments?: string; // For Instagram
  saves?: string; // For Instagram
  reposts?: string; // For Instagram
  metricsDisplay: string; // e.g., "25K Likes, 133 Comments..." or "2.3K Views in one day"
  question: string;
  options: { text: string; description: string; isCorrect: boolean }[];
  correctAnswerExplanation: string;
}

const samplePosts: PostData[] = [
  {
    id: 1,
    type: "instagram",
    imageUrl: "https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/IG Post_1c.png",
    headline: "From HPV to COVID-19: Vaccines, Big Pharma Investments and Profit Behind Global Health Crisis?",
    timeAgo: "1 day ago",
    likes: "25K",
    comments: "133",
    saves: "90",
    reposts: "157K",
    metricsDisplay: "25K Likes, 133 Comments, 90 saves & 157K reposts",
    question: "What might have influenced the creator to make content that gained this much attention?",
    options: [
      { text: "Clickbait", description: "Headline designed to attract attention and entice users to click.", isCorrect: false },
      { text: "Deeper trust issues", description: "The post is a part of an anti-vaccine narrative tapping into underlying distrust in large institutions like pharmaceutical companies, foundations, or global health bodies.", isCorrect: true },
      { text: "Manipulation", description: "Some content created such as claims, strategies - to decrease public trust in certain companies (Big Pharma) and promote alternative (unverified) treatments, 'natural cures', or competing pharma stocks.", isCorrect: false },
    ],
    correctAnswerExplanation: "This post taps into existing public distrust of large institutions and pharmaceutical companies, which is a common tactic in misinformation campaigns."
  },
  {
    id: 2,
    type: "youtube",
    imageUrl: "https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/YT Thumbnail_ 6.png",
    headline: "HOLLYWOOD'S BIGGEST FEUD!",
    source: "E! News",
    views: "2.3K",
    timeAgo: "1 day ago",
    metricsDisplay: "2.3K Views in one day",
    question: "What might have influenced the creator to make content that gained this much attention?",
    options: [
      { text: "Awareness", description: "Creators believe they're informing the public about Hollywood power plays and PR manipulation.", isCorrect: false },
      { text: "Sensationalizing", description: "A news style might sensationalize a small disagreement into a 'feud' or make it seem like a huge scandal. A story more dramatic in nature draws in viewers.", isCorrect: true },
      { text: "Clout Baiting", description: "Clout baiting means doing or saying something solely to get attention, followers, or social media fame - not because it's genuine.", isCorrect: false },
    ],
    correctAnswerExplanation: "The headline 'HOLLYWOOD'S BIGGEST FEUD!' is a classic example of sensationalism, designed to exaggerate a minor event for increased viewership."
  }
];

const BehindTheBuzz = () => {
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'game' | 'result'>('intro');
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [polarizationScore, setPolarizationScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentScreen === 'game') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            setCurrentScreen('result');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentScreen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);
    const currentPost = samplePosts[currentPostIndex];
    if (currentPost.options[index].isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setPolarizationScore((prevScore) => Math.min(100, prevScore + 30));
    } else {
      setPolarizationScore((prevScore) => Math.max(0, prevScore - 15));
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentPostIndex < samplePosts.length - 1) {
      setCurrentPostIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentScreen('result');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const renderIntroScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
      <Card className="max-w-2xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-10">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-[#FF5A5F] rounded-xl flex items-center justify-center mr-4">
            <span className="text-white font-bold text-xl">M5</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#FF5A5F]">Phase II</h1>
            <h2 className="text-3xl font-bold text-black">Module 4: Behind the Buzz</h2>
          </div>
        </div>

        <div className="bg-[#F1F5F9] rounded-md p-4 mb-6">
          <p className="text-sm text-gray-600">Walkthrough video (small screen recording)</p>
        </div>

        <p className="text-gray-700 mb-6">
          Time to dive into the minds behind the viral! Pick your prompts and uncover what really makes people hit 'share'. See how personal motives and biases spark chain reactions across your feed - and maybe even the whole internet!
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-purple-500">🟣</span>
            <span>Intermediate Level</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>02:00</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⭐</span>
            <span>Score is calculated in this module</span>
          </div>
        </div>

        <Button
          className="w-full bg-[#6B46C1] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#5A3A9E] transition"
          onClick={() => setCurrentScreen('game')}
        >
          Let's begin <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </Card>
    </div>
  );

  const renderGameScreen = () => {
    const currentPost = samplePosts[currentPostIndex];
    const isLastPost = currentPostIndex === samplePosts.length - 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <Card className="max-w-3xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#FF5A5F] rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">M2</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Behind the Buzz</h1>
                <p className="text-sm text-gray-600">Trace the spark that sets your feed on fire!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Polarization Score</p>
                <Progress value={polarizationScore} className="w-24 h-2 bg-gray-200" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{currentPostIndex + 1}/{samplePosts.length} Left</p>
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold mb-4">Headline #{currentPostIndex + 1}</h3>
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-start gap-4">
              {currentPost.type === "instagram" ? (
                <img src={currentPost.imageUrl} alt="Post" className="w-24 h-24 object-cover rounded-md" />
              ) : (
                <div className="relative w-32 h-20 flex-shrink-0">
                  <img src={currentPost.imageUrl} alt="YouTube Thumbnail" className="w-full h-full object-cover rounded-md" />
                  <Play className="absolute inset-0 m-auto w-8 h-8 text-white opacity-80" fill="white" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-lg mb-1">{currentPost.headline}</p>
                {currentPost.type === "instagram" ? (
                  <div className="text-sm text-gray-500">
                    <span>@{currentPost.source || 'user_name'}</span> • <span>{currentPost.timeAgo}</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <span>{currentPost.source}</span> • <span>{currentPost.views} views</span> • <span>{currentPost.timeAgo}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Let's break it down:</p>
              <Button className="w-full bg-[#FFC2C5] text-[#FF5A5F] font-semibold py-2 rounded-lg hover:bg-[#FFB0B5] transition">
                {currentPost.metricsDisplay}
              </Button>
            </div>
          </div>

          <p className="text-lg font-medium mb-4">{currentPost.question}</p>
          <p className="text-sm text-gray-600 mb-6">Choose the most likely</p>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {currentPost.options.map((option, index) => (
              <Card
                key={index}
                className={`p-4 rounded-xl shadow-sm cursor-pointer transition ${selectedOption === index ? 'bg-[#E9D5FF] border-[#6B46C1]' : 'bg-white hover:shadow-md'}`}
                onClick={() => handleOptionClick(index)}
              >
                <h4 className="font-semibold text-base mb-1">{option.text}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
              </Card>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-[#F1F5F9] rounded-xl">
              <h4 className="font-semibold text-lg mb-2">Explanation:</h4>
              <p className="text-gray-700">{currentPost.correctAnswerExplanation}</p>
            </div>
          )}

          <Button
            className="w-full mt-6 bg-[#6B46C1] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#5A3A9E] transition"
            onClick={handleNext}
            disabled={!showExplanation}
          >
            {isLastPost ? 'View Results' : 'Next Post'} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Card>
      </div>
    );
  };

  const renderResultScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
      <Card className="max-w-2xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-16 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center mr-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-semibold text-black">Module 3: Complete</h1>
            <p className="text-gray-700 text-sm mt-1">
              ✓ {score}/{samplePosts.length} motivations behind a creator's mind figured!
            </p>
          </div>
        </div>

        <div className="mt-10 mb-10">
          <p className="text-gray-700 mb-4">Your new score is</p>
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
                strokeDashoffset="97.34"
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
              <span className="text-4xl font-semibold text-gray-700">69%</span>
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
          onClick={() => window.location.href = '/dashboard'}
          className="mt-6 px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base"
        >
          Back to Dashboard →
        </Button>
      </Card>
    </div>
  );

  switch (currentScreen) {
    case 'intro':
      return renderIntroScreen();
    case 'game':
      return renderGameScreen();
    case 'result':
      return renderResultScreen();
    default:
      return null;
  }
};

export default BehindTheBuzz;
