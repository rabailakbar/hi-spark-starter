import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImageData {
  id: number;
  filename: string;
  isFake: boolean;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const FakeOrFact = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isComplete, setIsComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Sample data for the game
  const sampleImages: ImageData[] = [
    {
      id: 1,
      filename: "IG Post_1c.png",
      isFake: true,
      explanation: "This image shows signs of digital manipulation - inconsistent lighting and pixelation around edges.",
      difficulty: "easy"
    },
    {
      id: 2,
      filename: "IGR_3c.png", 
      isFake: false,
      explanation: "This appears to be a genuine social media post with authentic engagement patterns.",
      difficulty: "medium"
    },
    {
      id: 3,
      filename: "YT Headline_ 8b.png",
      isFake: true,
      explanation: "The headline uses sensationalist language and the image quality suggests AI generation.",
      difficulty: "hard"
    },
    {
      id: 4,
      filename: "YouTube Thumbnail_ 4a.png",
      isFake: false,
      explanation: "This thumbnail follows standard YouTube design patterns and appears authentic.",
      difficulty: "easy"
    },
    {
      id: 5,
      filename: "IG_9b.png",
      isFake: true,
      explanation: "Multiple red flags: unrealistic proportions, inconsistent shadows, and artificial color saturation.",
      difficulty: "medium"
    },
    {
      id: 6,
      filename: "IG_10a.png",
      isFake: false,
      explanation: "Natural lighting, realistic proportions, and authentic social media formatting.",
      difficulty: "easy"
    },
    {
      id: 7,
      filename: "YTT_6b.png",
      isFake: true,
      explanation: "AI-generated elements are visible in the text rendering and background details.",
      difficulty: "hard"
    },
    {
      id: 8,
      filename: "YTT_7a.png",
      isFake: false,
      explanation: "Professional thumbnail design with consistent branding and authentic visual elements.",
      difficulty: "medium"
    },
    {
      id: 9,
      filename: "YTH_R.png",
      isFake: true,
      explanation: "The headline contains clickbait language and the image shows signs of digital manipulation.",
      difficulty: "easy"
    },
    {
      id: 10,
      filename: "IGR_8e.png",
      isFake: false,
      explanation: "Genuine Instagram reel with authentic user engagement and natural content flow.",
      difficulty: "medium"
    }
  ];

  useEffect(() => {
    // Shuffle and set images
    const shuffled = [...sampleImages].sort(() => Math.random() - 0.5);
    setImages(shuffled);
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsComplete(true);
    }
  }, [gameStarted, timeLeft]);

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const currentImage = images[currentImageIndex];
    const isCorrect = answer === currentImage.isFake;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentImageIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(300);
    setIsComplete(false);
    setGameStarted(false);
    const shuffled = [...sampleImages].sort(() => Math.random() - 0.5);
    setImages(shuffled);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <div className="max-w-2xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-16 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Fake or Fact?</h1>
            <p className="text-lg text-gray-600 mb-6">
              Test your ability to spot fake images and content. You'll be shown various social media posts and need to determine if they're real or fake.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">How to Play:</h3>
              <ul className="text-sm text-blue-800 text-left space-y-1">
                <li>• Look carefully at each image</li>
                <li>• Click "Fake" or "Fact" based on your analysis</li>
                <li>• You have 5 minutes to complete as many as possible</li>
                <li>• Get explanations for each answer</li>
              </ul>
            </div>
          </div>
          <Button
            size="lg"
            onClick={startGame}
            className="px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-lg"
          >
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / images.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <div className="max-w-2xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-16 text-center">
          {/* Header with icon and title */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-semibold text-black">Module 6: Complete</h1>
              <p className="text-gray-700 text-sm mt-1">
                ✓ {score}/{images.length} Images Analyzed! Good Job
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
                  strokeDashoffset={314.16 - (314.16 * percentage / 100)}
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
                <span className="text-4xl font-semibold text-gray-700">{percentage}%</span>
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
        </div>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];
  const progress = ((currentImageIndex + 1) / images.length) * 100;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Fake or Fact?</h1>
            <p className="text-muted-foreground">Question {currentImageIndex + 1} of {images.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Image Display */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <img
                src={`https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/${currentImage.filename}`}
                alt={`Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Difficulty:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentImage.difficulty)}`}>
                  {currentImage.difficulty.toUpperCase()}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Answer Buttons */}
        {!showResult ? (
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => handleAnswer(false)}
              className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              FACT
            </Button>
            <Button
              size="lg"
              onClick={() => handleAnswer(true)}
              className="px-8 py-4 text-lg bg-red-600 hover:bg-red-700 text-white"
            >
              <XCircle className="w-5 h-5 mr-2" />
              FAKE
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold mb-4 ${
                selectedAnswer === currentImage.isFake 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedAnswer === currentImage.isFake ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Correct!
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Incorrect
                  </>
                )}
              </div>
              <p className="text-gray-700 text-lg">
                The answer is: <span className="font-bold">{currentImage.isFake ? 'FAKE' : 'FACT'}</span>
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Explanation:</h3>
              <p className="text-gray-700">{currentImage.explanation}</p>
            </div>

            <Button
              size="lg"
              onClick={handleNext}
              className="px-8 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
            >
              {currentImageIndex < images.length - 1 ? 'Next Question' : 'Finish Game'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FakeOrFact;
