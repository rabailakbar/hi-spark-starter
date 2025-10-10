import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ArrowRight, CheckCircle, RotateCcw, Users } from "lucide-react";

interface DebateScenario {
  id: number;
  headline: string;
  imageUrl: string;
  description: string;
  debateQuestion: string;
  prompts: {
    id: number;
    text: string;
    isCorrect: boolean;
  }[];
}

const sampleScenarios: DebateScenario[] = [
  {
    id: 1,
    headline: "AI is an insult to life itself. Miyazaki's predictions come true.",
    imageUrl: "https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/miyazaki.png",
    description: "Hayao Miyazaki, the legendary animator behind Studio Ghibli, has been vocal about his concerns regarding artificial intelligence. In a 2016 documentary, he expressed strong disapproval of AI-generated Ghibli-style images, calling them 'an insult to life itself.' His comments sparked widespread discussion about the role of AI in creative industries and whether it threatens or enhances human creativity.",
    debateQuestion: "Was Miyazaki right to call AI an insult to life - or is it actually expanding what life can create?",
    prompts: [
      {
        id: 1,
        text: "AI doesn't create life - it imitates it. From medicine to climate research, it helps us solve problems, not create it.",
        isCorrect: false
      },
      {
        id: 2,
        text: "AI is a reflection of human creativity. It's here to expand artistry and imagination, like the very things that define life.",
        isCorrect: true
      },
      {
        id: 3,
        text: "Every era has its new invention. Just as machines threatened painting, AI challenges art to evolve, not disappear.",
        isCorrect: false
      }
    ]
  }
];

const DebateSwitch = () => {
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'scenario' | 'debate' | 'result'>('intro');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [polarizationScore, setPolarizationScore] = useState(90);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [debatePhase, setDebatePhase] = useState<'pro' | 'con'>('pro');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentScreen === 'debate') {
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

  const handlePromptClick = (promptId: number) => {
    setSelectedPrompt(promptId);
    setShowExplanation(true);
    const currentScenario = sampleScenarios[currentScenarioIndex];
    const prompt = currentScenario.prompts.find(p => p.id === promptId);
    
    if (prompt?.isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setPolarizationScore((prevScore) => Math.min(100, prevScore + 10));
    } else {
      setPolarizationScore((prevScore) => Math.max(0, prevScore - 5));
    }
  };

  const handleNext = () => {
    if (debatePhase === 'pro') {
      setDebatePhase('con');
      setSelectedPrompt(null);
      setShowExplanation(false);
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
          <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center mr-4">
            <span className="text-white font-bold text-xl">M6</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-cyan-600">Phase III</h1>
            <h2 className="text-3xl font-bold text-black">Module 6: Debate Switch</h2>
          </div>
        </div>

        <div className="bg-[#F1F5F9] rounded-md p-4 mb-6">
          <p className="text-sm text-gray-600">Walkthrough video (small screen recording)</p>
        </div>

        <p className="text-gray-700 mb-6">
          Ready. Set. Debate! You've got 90 seconds to bring your best arguments to the table! Defend your stance like a pro - but wait for it... plot twist! You'll have to switch sides and fight for the opposite view. Every round flexes your perspective power, builds empathy, and drops that polarization score. The more open-minded you get, the closer you are to victory!
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-red-500">🔴</span>
            <span>Advanced Level</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>02:00</span>
          </div>
        </div>

        <Button
          className="w-full bg-[#6B46C1] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#5A3A9E] transition"
          onClick={() => setCurrentScreen('scenario')}
        >
          Let's begin <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </Card>
    </div>
  );

  const renderScenarioScreen = () => {
    const currentScenario = sampleScenarios[currentScenarioIndex];

    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <Card className="max-w-4xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">M6</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Debate Switch</h1>
                <p className="text-sm text-gray-600">One debate, two sides, endless perspectives</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Polarization Score</p>
                <Progress value={polarizationScore} className="w-24 h-2 bg-gray-200" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{currentScenarioIndex + 1}/{sampleScenarios.length} Left</p>
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold mb-4">Headline #{currentScenarioIndex + 1}</h3>
          <p className="text-lg font-medium mb-6">{currentScenario.headline}</p>

          {/* Scenario Card */}
          <Card className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4">Scenario {currentScenarioIndex + 1}</h4>
            <div className="flex items-start gap-4">
              <img 
                src={currentScenario.imageUrl} 
                alt="Scenario" 
                className="w-32 h-32 object-cover rounded-md" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/placeholder.png";
                }}
              />
              <div className="flex-1">
                <p className="font-semibold text-lg mb-2">{currentScenario.headline}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{currentScenario.description}</p>
              </div>
            </div>
          </Card>

          {/* Debate Question */}
          <Card className="bg-purple-50 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4">The Debate</h4>
            <p className="text-lg font-medium text-gray-800 mb-4">{currentScenario.debateQuestion}</p>
            <p className="text-sm text-gray-600 mb-4">Ready to take a side?</p>
            <Button
              className="bg-[#6B46C1] text-white px-6 py-2 rounded-lg hover:bg-[#5A3A9E] transition"
              onClick={() => setCurrentScreen('debate')}
            >
              Start Now
            </Button>
          </Card>
        </Card>
      </div>
    );
  };

  const renderDebateScreen = () => {
    const currentScenario = sampleScenarios[currentScenarioIndex];

    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <Card className="max-w-4xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">M6</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Debate Switch</h1>
                <p className="text-sm text-gray-600">One debate, two sides, endless perspectives</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Polarization Score</p>
                <Progress value={polarizationScore} className="w-24 h-2 bg-gray-200" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{currentScenarioIndex + 1}/{sampleScenarios.length} Left</p>
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold mb-4">Headline #{currentScenarioIndex + 1}</h3>
          <p className="text-lg font-medium mb-6">{currentScenario.headline}</p>

          {/* Instruction */}
          <p className="text-lg font-medium mb-6">
            Argue {debatePhase === 'pro' ? 'in favor of' : 'against'} the headline by choosing the best prompt
          </p>

          {/* Debate Podiums */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-200 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm font-medium">Opponent LLM</p>
              <p className="text-xs text-gray-500 mt-1">XXXXXXXXXXXXX</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-200 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm font-medium">You</p>
              <p className="text-xs text-gray-500 mt-1">XXXXXXXXXXXXX</p>
            </div>
          </div>

          {/* Prompt Options */}
          <div className="space-y-4 mb-6">
            {currentScenario.prompts.map((prompt) => (
              <Card
                key={prompt.id}
                className={`p-4 rounded-xl shadow-sm cursor-pointer transition ${
                  selectedPrompt === prompt.id 
                    ? 'bg-[#E9D5FF] border-[#6B46C1]' 
                    : 'bg-white hover:shadow-md'
                }`}
                onClick={() => handlePromptClick(prompt.id)}
              >
                <p className="text-gray-800">{prompt.text}</p>
              </Card>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-[#F1F5F9] rounded-xl">
              <h4 className="font-semibold text-lg mb-2">Explanation:</h4>
              <p className="text-gray-700">
                {debatePhase === 'pro' 
                  ? "You've chosen a strong argument in favor of the headline. Now get ready to switch sides!"
                  : "Great job arguing both sides! This helps build empathy and reduces polarization."
                }
              </p>
            </div>
          )}

          <Button
            className="w-full mt-6 bg-[#6B46C1] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#5A3A9E] transition"
            onClick={handleNext}
            disabled={!showExplanation}
          >
            {debatePhase === 'pro' ? 'Switch Sides' : 'Complete Debate'} <ArrowRight className="ml-2 w-5 h-5" />
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
            <h1 className="text-3xl font-semibold text-black">Module 6: Complete</h1>
            <p className="text-gray-700 text-sm mt-1">
              ✓ 1/1 Debate done
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
                strokeDashoffset="157.08"
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
              <span className="text-4xl font-semibold text-gray-700">50%</span>
            </div>
          </div>

          {/* Motivational message */}
          <p className="text-gray-600 text-sm leading-relaxed">
            You've outsmarted polarization and leveled up your perspective!<br />
            Your curiosity's flying, Good Job!
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
    case 'scenario':
      return renderScenarioScreen();
    case 'debate':
      return renderDebateScreen();
    case 'result':
      return renderResultScreen();
    default:
      return null;
  }
};

export default DebateSwitch;
