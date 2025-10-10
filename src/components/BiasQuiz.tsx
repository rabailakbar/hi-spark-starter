import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, ThumbsUp, Clock, Play, CheckCircle, ArrowLeft } from "lucide-react";

interface BiasQuizProps {
  imageUrl: string;
  headline: string;
  questionNumber: number;
  onComplete?: () => void;
}

// Define biased words/phrases with difficulty levels
const biasedPhrases = {
  "lucky guesses": { difficulty: "medium", color: "#E9D5FF" },
  "just the truth": { difficulty: "hard", color: "#E9D5FF" },
  "hiding": { difficulty: "hard", color: "#E9D5FF" },
  "plain sight": { difficulty: "hard", color: "#E9D5FF" },
  "it's": { difficulty: "medium", color: "#E9D5FF" }
};

const BiasQuiz = ({ imageUrl, headline, questionNumber, onComplete }: BiasQuizProps) => {
  const [selections, setSelections] = useState<{ indices: number[], phrase: string, color: string | null }[]>([]);
  const [currentSelection, setCurrentSelection] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [buildingSelection, setBuildingSelection] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const headlineRef = useRef<HTMLDivElement>(null);

  // Split headline into words while preserving spaces and punctuation
  const words = headline.split(/(\s+)/);

  // Timer effect
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setQuizComplete(true);
    }
  }, [gameStarted, timeLeft]);

  const checkAndCommitPhrase = (indices: number[]) => {
    const sortedIndices = [...indices].sort((a, b) => a - b);
    const minIndex = sortedIndices[0];
    const maxIndex = sortedIndices[sortedIndices.length - 1];
    
    const allIndices = [];
    for (let i = minIndex; i <= maxIndex; i++) {
      allIndices.push(i);
    }
    
    const phrase = allIndices.map(i => words[i]).join('');
    
    // Check for exact match or partial match
    let matchedPhrase = Object.keys(biasedPhrases).find(key => {
      const normalizedPhrase = phrase.toLowerCase().trim();
      const normalizedKey = key.toLowerCase().trim();
      return normalizedPhrase === normalizedKey || normalizedPhrase.includes(normalizedKey);
    });
    
    if (matchedPhrase) {
      const color = biasedPhrases[matchedPhrase as keyof typeof biasedPhrases].color;
      setSelections(prev => [...prev, { indices: allIndices, phrase, color }]);
      setBuildingSelection([]);
    }
  };

  const handleMouseDown = (index: number) => {
    const isWhitespace = /^\s+$/.test(words[index]);
    if (isWhitespace) return;
    
    // Check if word is already in a previous selection - allow clicking to remove
    const selectionIndex = selections.findIndex(sel => sel.indices.includes(index));
    if (selectionIndex !== -1) {
      setSelections(prev => prev.filter((_, i) => i !== selectionIndex));
      setBuildingSelection([]);
      return;
    }
    
    // Check if word is adjacent to building selection
    if (buildingSelection.length > 0) {
      const lastIndex = Math.max(...buildingSelection);
      const firstIndex = Math.min(...buildingSelection);
      
      // Allow adding adjacent words (with space in between)
      if (index === lastIndex + 2 || index === firstIndex - 2) {
        const newBuilding = [...buildingSelection, index];
        setBuildingSelection(newBuilding);
        checkAndCommitPhrase(newBuilding);
        return;
      } else {
        // Start new building selection if not adjacent
        setBuildingSelection([index]);
        checkAndCommitPhrase([index]);
      }
    } else {
      // Start building selection
      setBuildingSelection([index]);
      checkAndCommitPhrase([index]);
    }
    
    setIsDragging(true);
    setCurrentSelection([index]);
  };

  const handleMouseEnter = (index: number) => {
    if (isDragging) {
      const isWhitespace = /^\s+$/.test(words[index]);
      if (isWhitespace) return;
      
      // Check if word is already in a previous selection
      const isAlreadySelected = selections.some(sel => sel.indices.includes(index));
      if (isAlreadySelected) return;
      
      setCurrentSelection(prev => {
        if (!prev.includes(index)) {
          return [...prev, index];
        }
        return prev;
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging && currentSelection.length > 0) {
      setIsDragging(false);
      
      // Get the selected phrase - include all words and spaces between min and max indices
      const sortedIndices = [...currentSelection].sort((a, b) => a - b);
      const minIndex = sortedIndices[0];
      const maxIndex = sortedIndices[sortedIndices.length - 1];
      
      // Include all elements between min and max (including spaces)
      const allIndices = [];
      for (let i = minIndex; i <= maxIndex; i++) {
        allIndices.push(i);
      }
      
      const phrase = allIndices.map(i => words[i]).join('');
      
      const matchedPhrase = Object.keys(biasedPhrases).find(key => {
        const normalizedPhrase = phrase.toLowerCase().trim();
        const normalizedKey = key.toLowerCase().trim();
        return normalizedPhrase === normalizedKey || normalizedPhrase.includes(normalizedKey);
      });
      
      const color = matchedPhrase 
        ? biasedPhrases[matchedPhrase as keyof typeof biasedPhrases].color 
        : null;
      
      if (color) {
        setSelections(prev => [...prev, { indices: allIndices, phrase, color }]);
        setBuildingSelection([]);
      }
      
      setCurrentSelection([]);
    }
  };

  const getWordStyle = (index: number) => {
    // Check if word is in building selection
    if (buildingSelection.includes(index)) {
      return {
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        padding: '4px 8px',
        borderRadius: '8px',
        margin: '0 2px',
        border: '2px dashed hsl(var(--primary))'
      };
    }
    
    // Check if word is in current selection (being dragged)
    if (currentSelection.includes(index)) {
      return {
        backgroundColor: 'hsl(var(--muted))',
        padding: '4px 8px',
        borderRadius: '8px',
        margin: '0 2px'
      };
    }
    
    // Check if word is in any completed selection
    const selection = selections.find(sel => sel.indices.includes(index));
    if (selection) {
      return {
        backgroundColor: selection.color || 'hsl(var(--muted))',
        padding: '4px 8px',
        borderRadius: '20px',
        margin: '0 2px'
      };
    }
    
    return undefined;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const polarizationScore = Math.round((selections.length / 5) * 100);

  // Call onComplete callback when quiz is complete
  useEffect(() => {
    if (selections.length >= 3 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selections.length, onComplete]);

  if (showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <div className="max-w-4xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-16">
          {/* Module Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M4</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Phase II Module 4: Spot the Bias</h1>
              <p className="text-lg text-gray-600 mb-4">
                Let's dive into the clues of a bias hunter! Look closely at headlines, YouTube thumbnails, and titles - can you spot the bias? Watch how certain words can make things sound bigger, louder, or more one-sided than they really are.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">For additional reference:</h3>
                <p className="text-sm text-blue-800">
                  Bias: "...information, opinions, or decisions are influenced by personal feelings or assumptions instead of facts..."
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Intermediate Level
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  02:00
                </span>
                <span>Score is calculated in this module</span>
              </div>
            </div>
          </div>

          {/* Walkthrough Video Placeholder */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Walkthrough Video</h3>
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Video placeholder</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => {
                setShowIntro(false);
                setGameStarted(true);
              }}
              className="px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-lg"
            >
              Let's begin →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <div className="max-w-2xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-16 text-center">
          {/* Header with icon and title */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-semibold text-black">Module 4: Complete</h1>
              <p className="text-gray-700 text-sm mt-1">
                ✓ 1/1 Biased Headlines Spotted! Good Job
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
                  strokeDashoffset="50.27"
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
                <span className="text-4xl font-semibold text-gray-700">84%</span>
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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - Exact match to image */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-6">
            <div className="text-6xl font-bold text-red-500">M2</div>
            <div>
              <h1 className="text-5xl font-bold mb-2">Spot the Bias</h1>
              <p className="text-2xl text-muted-foreground mb-3">
                What if words echo louder than actions?
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span className="text-lg">{formatTime(timeLeft)}</span>
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
            <div className="text-sm text-muted-foreground">
              {5 - selections.length}/5 Left
            </div>
          </div>
        </div>

        {/* YouTube-style content - Exact match to image */}
        <div className="mb-8">
          <p className="text-lg text-muted-foreground mb-4">Image #{questionNumber}</p>
          
          {/* YouTube-style card */}
          <Card className="overflow-hidden bg-white border border-gray-200 mb-4">
            <div className="p-4">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="w-48 h-36 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={`Question ${questionNumber}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    FREAKISH PREDICTIONS How many times can there be lucky guesses before it's just the truth hiding in plain sight? #SimpsonsConspiracy
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>1.2K views</span>
                    <span>1 day ago</span>
                    <span>Source</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Headline text box - Exact match to image */}
          <Card className="p-6 border border-gray-200 bg-white">
            <div className="text-lg font-medium text-center mb-4 text-gray-900">
              "How many times can there be lucky guesses before it's just the truth hiding in plain sight?" #SimpsonsConspiracy
            </div>
            <p className="text-center text-muted-foreground mb-6">
              Click words that help you spot any bias
            </p>
            
            <div 
              ref={headlineRef}
              className="text-xl font-medium leading-relaxed text-center select-none"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {words.map((word, index) => {
                const isWhitespace = /^\s+$/.test(word);
                if (isWhitespace) {
                  return <span key={index}>{word}</span>;
                }
                
                const isInCurrentSelection = currentSelection.includes(index);
                const isInAnySelection = selections.some(sel => sel.indices.includes(index));
                const wordStyle = getWordStyle(index);
                
                return (
                  <span
                    key={index}
                    onMouseDown={() => handleMouseDown(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    style={wordStyle}
                    className={`cursor-pointer inline-block transition-all duration-200 ${
                      !wordStyle && !isInCurrentSelection && !isInAnySelection
                        ? 'hover:outline hover:outline-2 hover:outline-dashed hover:outline-foreground/40 hover:rounded-lg hover:px-1'
                        : ''
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
            
            {/* Success message - Exact match to image */}
            {selections.length >= 3 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Star className="w-5 h-5" fill="#FFEB01" stroke="#FFEB01" />
                <span className="font-medium text-foreground">Good Job</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BiasQuiz;