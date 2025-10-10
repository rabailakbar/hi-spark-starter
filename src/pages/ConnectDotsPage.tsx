import { useSearchParams } from "react-router-dom";
import ConnectDotsQuiz from "@/components/ConnectDotsQuiz";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConnectDotsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleId = searchParams.get("id") || "M4";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
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
            <h1 className="text-3xl font-bold">Connect Dots Quiz</h1>
            <p className="text-muted-foreground">Test your critical thinking skills</p>
          </div>
        </div>
      </div>

      {/* Quiz Component */}
      <div className="p-6">
        <ConnectDotsQuiz moduleId={moduleId} />
      </div>
    </div>
  );
};

export default ConnectDotsPage;
