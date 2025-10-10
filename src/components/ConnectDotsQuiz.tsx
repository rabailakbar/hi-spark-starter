import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ThumbsUp, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Answer {
  id: string;
  answer_number: number;
  title: string;
  explanation: string;
}

interface Question {
  id: string;
  question_text: string;
  headline: string;
  tiktok_image_filename: string;
  correct_answer: number;
  answers: Answer[];
}

interface ConnectDotsQuizProps {
  moduleId: string;
}

const ConnectDotsQuiz = ({ moduleId }: ConnectDotsQuizProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [polarizationScore] = useState(98);
  const [isComplete, setIsComplete] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    fetchQuestions();
  }, [moduleId]);

  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestionIndex]) {
      loadImage(questions[currentQuestionIndex].tiktok_image_filename);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchQuestions = async () => {
    const { data: questionsData, error: questionsError } = await supabase
      .from("connect_dots_questions")
      .select("*")
      .eq("module_id", moduleId)
      .order("question_number", { ascending: true });

    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return;
    }

    if (!questionsData || questionsData.length === 0) return;

    const questionsWithAnswers = await Promise.all(
      questionsData.map(async (question) => {
        const { data: answersData } = await supabase
          .from("connect_dots_answers")
          .select("*")
          .eq("question_id", question.id)
          .order("answer_number", { ascending: true });

        return {
          ...question,
          answers: answersData || [],
        };
      })
    );

    setQuestions(questionsWithAnswers);
  };

  const loadImage = async (filename: string) => {
    const { data } = supabase.storage
      .from("Thesis")
      .getPublicUrl(`Modules/${filename}`);
    
    setImageUrl(data.publicUrl);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (questions.length === 0) {
    return <div className="text-foreground">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionsLeft = questions.length - currentQuestionIndex;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="inline-block bg-primary/10 rounded-full p-6 mb-4">
            <ThumbsUp className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-4">
            Module Complete!
          </h1>
          <p className="text-2xl text-muted-foreground mb-8">
            Great work on Module 5: Connect the Dots
          </p>
          <div className="bg-muted rounded-lg p-8">
            <div className="text-5xl font-bold text-foreground mb-2">
              {polarizationScore}%
            </div>
            <p className="text-lg text-muted-foreground">
              Final Polarization Score
            </p>
          </div>
          <Button
            size="lg"
            className="px-12 py-6 text-lg mt-8"
            onClick={() => navigate('/debate')}
          >
            Next Module
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-6">
            <div className="text-[120px] font-bold text-foreground leading-none">M5</div>
            <div className="pt-2">
              <h1 className="text-5xl font-bold text-foreground mb-3">Connect the Dots</h1>
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="w-6 h-6" />
                <span className="text-2xl font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <div className="text-right pt-2">
            <div className="bg-muted rounded-full px-8 py-3 mb-2 inline-block">
              <span className="text-foreground font-semibold text-xl">{polarizationScore}%</span>
            </div>
            <div className="text-sm text-muted-foreground mb-6">Polarization Score</div>
            <div className="text-3xl font-bold text-foreground">
              {questionsLeft}/{questions.length} Left
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-muted rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-foreground text-center">
            {currentQuestion.question_text}
          </h2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-[350px_1fr] gap-8">
          {/* TikTok Image */}
          <div className="rounded-2xl overflow-hidden bg-black h-fit">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="TikTok post" 
                className="w-full h-auto"
              />
            )}
          </div>

          {/* Headline and Answers */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <p className="text-foreground text-xl leading-relaxed">
                "{currentQuestion.headline}"
              </p>
            </div>

            <p className="text-foreground font-medium text-lg">Select the best answer!</p>

            {/* Answer Cards */}
            <div className="grid grid-cols-2 gap-6">
              {currentQuestion.answers.map((answer) => (
                <Card
                  key={answer.id}
                  className={`p-8 cursor-pointer transition-all hover:shadow-lg relative ${
                    selectedAnswer === answer.answer_number
                      ? "border-2 border-primary bg-primary/10"
                      : "border border-border hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setSelectedAnswer(answer.answer_number);
                    setTimeout(() => setIsComplete(true), 1000);
                  }}
                >
                  {selectedAnswer === answer.answer_number && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-2">
                      <ThumbsUp className="w-5 h-5" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {answer.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {answer.explanation}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectDotsQuiz;
