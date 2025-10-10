import { AlarmClock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuizHeaderProps {
  moduleNumber: string;
  title: string;
  subtitle: string;
  timeRemaining: string;
  score: number;
  questionsLeft: string;
}

const QuizHeader = ({
  moduleNumber,
  title,
  subtitle,
  timeRemaining,
  score,
  questionsLeft
}: QuizHeaderProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <div className="flex items-start justify-between gap-8">
        {/* Left side - Title and Timer */}
        <div className="flex items-start gap-6">
          <div className="text-8xl font-bold">{moduleNumber}</div>
          <div className="pt-4">
            <h1 className="text-5xl font-bold mb-2">{title}</h1>
            <p className="text-xl text-foreground mb-4">{subtitle}</p>
            <div className="flex items-center gap-2 text-foreground">
              <AlarmClock className="w-5 h-5" />
              <span className="text-lg">{timeRemaining}</span>
            </div>
          </div>
        </div>

        {/* Right side - Score and Progress */}
        <div className="text-right min-w-[280px]">
          <div className="mb-4">
            <div className="flex items-center justify-end gap-3 mb-2">
              <span className="text-sm text-muted-foreground">Polarization Score</span>
              <span className="text-2xl font-bold">{score}%</span>
            </div>
            <Progress value={score} className="h-2" />
          </div>
          <p className="text-lg font-medium">{questionsLeft}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;
