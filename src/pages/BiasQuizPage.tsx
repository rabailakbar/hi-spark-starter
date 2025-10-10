import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import BiasQuiz from "@/components/BiasQuiz";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BiasQuizPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleId = searchParams.get("id") || "M3";
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const sampleData = {
    imageUrl: "https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/YT Headline_ 8b.png",
    headline: "How many times can there be lucky guesses before it's just the truth hiding in plain sight? #SimpsonsConspiracy",
    questionNumber: currentQuestion
  };

  const handleComplete = () => {
    if (currentQuestion < 5) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <div className="max-w-2xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-16 text-center">
          <h1 className="text-3xl font-semibold text-black mb-4">Bias Quiz Complete!</h1>
          <p className="text-gray-700 mb-6">You've completed all bias detection questions.</p>
          <Button
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
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
              <h1 className="text-3xl font-bold">Bias Detection Quiz</h1>
              <p className="text-muted-foreground">Question {currentQuestion} of 5</p>
            </div>
          </div>
        </div>

        {/* Quiz Component */}
        <BiasQuiz
          imageUrl={sampleData.imageUrl}
          headline={sampleData.headline}
          questionNumber={sampleData.questionNumber}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default BiasQuizPage;
