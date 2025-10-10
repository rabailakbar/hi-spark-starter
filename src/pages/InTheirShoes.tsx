import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Star, AlarmClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type Screen = "intro" | "roleSelection" | "question";
type Role = {
  title: string;
  subtitle: string;
};

const InTheirShoes = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>("intro");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const roles: Role[] = [
    { title: "Coach", subtitle: "Physical Training" },
    { title: "Teacher", subtitle: "" },
    { title: "Parent", subtitle: "" },
    { title: "Influencer", subtitle: "Social Media" },
    { title: "Moderator", subtitle: "School" },
    { title: "President", subtitle: "School Club" },
    { title: "Brother", subtitle: "Older Sibling" },
    { title: "Friend", subtitle: "" },
  ];

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setCurrentScreen("question");
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  if (currentScreen === "intro") {
    return (
      <main className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-4xl font-semibold text-foreground">M7</span>
              </div>
              <div>
                <p className="text-xl text-foreground mb-1">Phase III</p>
                <h1 className="text-3xl font-semibold text-foreground">Module 7: In their shoes</h1>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-24 mb-6 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground text-lg font-medium">Walkthrough video</p>
                <p className="text-muted-foreground text-sm">(small screen recording)</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-foreground text-base leading-relaxed">
                Welcome to your <span className="font-semibold">last and final challenge</span>! In this module, you'll
                step into different roles to see how perspective shapes understanding. Each round, you'll draw a random
                role and use prompts to defend or explain a headline. The better you practice empathy and reasoning, the
                lower your polarization score. Ready to put everything you've learned to the test?
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-sm">Hard Level</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">Time</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="w-5 h-5" />
                  <span className="text-sm">Score is calculated in this module</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  console.log("Starting module, moving to role selection");
                  setCurrentScreen("roleSelection");
                  
                }}
                variant="secondary"
                size="lg"
                className="cursor-pointer"
              >
                Click here to start
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (currentScreen === "roleSelection") {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-semibold text-foreground">M7</span>
              </div>
              <div>
                <h1 className="text-4xl font-semibold text-foreground mb-2">In their shoes</h1>
                <p className="text-base text-muted-foreground mb-3">
                  Last but not the least, Step into another role, and make their pov make sense.
                </p>
                <div className="flex items-center gap-2 text-foreground">
                  <AlarmClock className="w-5 h-5" />
                  <span className="text-lg font-medium">05:00</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <Progress value={98} className="w-64 h-3 mb-1" />
                <p className="text-sm text-muted-foreground">Polarization Score</p>
                <p className="text-2xl font-semibold text-foreground">98%</p>
              </div>
              <p className="text-lg font-medium text-foreground">1/3 Left</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-3">Choose Your Role:</h2>
            <p className="text-lg text-muted-foreground">
              Each scenario puts you in a different position of power and perspective
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
            {roles.map((role, index) => (
              <Card
                key={index}
                onClick={() => handleRoleSelect(role)}
                className="bg-muted hover:bg-muted/70 border-border cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-8 flex flex-col items-center justify-center text-center min-h-[180px]"
              >
                <h3 className="text-xl font-semibold text-foreground mb-1">{role.title}</h3>
                {role.subtitle && <p className="text-sm text-muted-foreground">{role.subtitle}</p>}
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Question Screen
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-semibold text-foreground">M7</span>
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-foreground mb-2">In their shoes</h1>
              <p className="text-base text-muted-foreground mb-3">
                Last but not the least, Step into another role, and make their pov make sense.
              </p>
              <div className="flex items-center gap-2 text-foreground">
                <AlarmClock className="w-5 h-5" />
                <span className="text-lg font-medium">05:00</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <Progress value={98} className="w-64 h-3 mb-1" />
              <p className="text-sm text-muted-foreground">Polarization Score</p>
              <p className="text-2xl font-semibold text-foreground">98%</p>
            </div>
            <p className="text-lg font-medium text-foreground">1/9 Left</p>
          </div>
        </div>

        {/* Question Content */}
        <div className="grid grid-cols-2 gap-8">
          {/* Scenario Card */}
          <Card className="bg-muted border-border p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Scenario #1</h2>
            <h3 className="text-xl font-semibold text-foreground mb-6">
              {selectedRole?.title}
              {selectedRole?.subtitle && (
                <span className="block text-lg text-muted-foreground mt-1">{selectedRole.subtitle}</span>
              )}
            </h3>
            <p className="text-base text-foreground leading-relaxed">
              You post a reel about gender equality. Overnight, your DMs explode — some praise you as a feminist hero,
              others call you a "man-hater." Brand sponsors email, saying "keep it less political."
            </p>
          </Card>

          {/* Question and Answers */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-foreground text-background rounded-full text-sm">
                  ?
                </span>
                Question — Approach: What's the mindful move here?
              </h2>

              <div className="space-y-4">
                <Card
                  onClick={() => handleAnswerSelect("A")}
                  className={`p-6 cursor-pointer transition-all hover:bg-accent border-border ${
                    selectedAnswer === "A" ? "bg-accent" : "bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-background text-foreground rounded-full font-semibold flex-shrink-0">
                      A
                    </span>
                    <p className="text-foreground">
                      Post a calm follow-up explaining that gender equality benefits everyone, not just one side.
                    </p>
                  </div>
                </Card>

                <Card
                  onClick={() => handleAnswerSelect("B")}
                  className={`p-6 cursor-pointer transition-all hover:bg-accent border-border ${
                    selectedAnswer === "B" ? "bg-accent" : "bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-background text-foreground rounded-full font-semibold flex-shrink-0">
                      B
                    </span>
                    <p className="text-foreground">
                      Host a live Q&A to let both supporters and critics share their views, and clarify your intent.
                    </p>
                  </div>
                </Card>

                <Card
                  onClick={() => handleAnswerSelect("C")}
                  className={`p-6 cursor-pointer transition-all hover:bg-accent border-border ${
                    selectedAnswer === "C" ? "bg-accent" : "bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-background text-foreground rounded-full font-semibold flex-shrink-0">
                      C
                    </span>
                    <p className="text-foreground">
                      Edit your caption to include a disclaimer about respecting all opinions, without changing the
                      content itself.
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-auto flex items-center justify-between">
              <p className="text-sm text-muted-foreground">‹ next 1/2›</p>
              <Button onClick={handleNext} disabled={!selectedAnswer} variant="secondary" size="lg" className="px-12">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InTheirShoes;
