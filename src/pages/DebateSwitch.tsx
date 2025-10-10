import { useState, useEffect } from "react";
import { Timer, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const DEBATE_TOPIC = `"AI is an insult to life itself." Miyazaki's predictions come true.`;

const DebateSwitch = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(90);
  const [figureImageUrl, setFigureImageUrl] = useState<string>("");
  const [llmArgument, setLlmArgument] = useState<string>("Thinking...");
  const [userPrompts, setUserPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsCompleted(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Load image
  useEffect(() => {
    const fetchImage = async () => {
      const extensions = ["png", "jpg", "jpeg", "svg", "webp"];
      for (const ext of extensions) {
        const { data } = supabase.storage.from("Thesis").getPublicUrl(`Modules/Group 59.${ext}`);
        if (data) {
          setFigureImageUrl(data.publicUrl);
          break;
        }
      }
    };
    fetchImage();
  }, []);

  // Initialize
  useEffect(() => {
    const init = async () => {
      await getLlmArgument([]);
      await generateUserPrompts();
    };
    init();
  }, []);

  // --- Prompt generator ---
  const parsePrompts = (text: string): string[] => {
    try {
      const first = text.indexOf("[");
      const last = text.lastIndexOf("]");
      if (first >= 0 && last > first) {
        const arr = JSON.parse(text.slice(first, last + 1));
        if (Array.isArray(arr)) {
          return arr
            .map((s) => String(s).trim())
            .filter(Boolean)
            .slice(0, 3);
        }
      }
    } catch {}
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const cleaned = lines
      .map((l) =>
        l
          .replace(/^[\d\.\)\-]+\s*/, "")
          .replace(/^["']|["']$/g, "")
          .trim(),
      )
      .filter(Boolean);
    if (cleaned.length >= 3) return cleaned.slice(0, 3);
    return [
      "AI helps people do creative work faster so we can focus on what matters.",
      "AI can save lives by improving medical diagnosis and treatment.",
      "Used responsibly, AI makes it easier to solve problems and care for others.",
    ];
  };

  const generateUserPrompts = async () => {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `Return ONLY a JSON array of 3 short strings arguing IN FAVOR of ${DEBATE_TOPIC}.`,
            },
          ],
          temperature: 0.8,
          max_tokens: 200,
        }),
      });
      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content || "";
      const prompts = parsePrompts(raw);
      setUserPrompts(prompts);
      setShowUserOptions(true);
    } catch (e) {
      setUserPrompts([
        "AI helps people do creative work faster so we can focus on what matters.",
        "AI can save lives by improving medical diagnosis and treatment.",
        "Used responsibly, AI makes it easier to solve problems and care for others.",
      ]);
      setShowUserOptions(true);
    }
  };

  // --- LLM Argument (AGAINST topic) ---
  const getLlmArgument = async (messages: any[]) => {
    setIsLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are arguing AGAINST the topic: ${DEBATE_TOPIC}. Respond in 1 short, simple, confident sentence.`,
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });
      const data = await res.json();
      setLlmArgument(data?.choices?.[0]?.message?.content || "No response");
    } catch {
      setLlmArgument("⚠️ Unable to fetch AI argument.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = async (i: number) => {
    setSelectedPrompt(i);
    setShowUserOptions(false);
    const chosen = userPrompts[i - 1];
    setTimeout(async () => {
      setLlmArgument("Thinking...");
      await getLlmArgument([{ role: "user", content: chosen }]);
      await generateUserPrompts();
      setSelectedPrompt(null);
      setRound((r) => r + 1);
    }, 1200);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (isCompleted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl font-semibold">⏰ Debate Over</h1>
          <p className="text-lg text-muted-foreground">Great job! You’ve completed the debate.</p>
          <button
            onClick={() => navigate("/debate/final")}
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80"
          >
            Next Module →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-semibold mb-4">Burst the Bubble</h1>
          <p className="text-xl mb-2 text-center">Topic: {DEBATE_TOPIC}</p>
          <p className="text-sm text-primary font-medium text-center mb-8">
            Argue in favor of the headline by choosing the best prompt.
          </p>
          <Progress value={(timeLeft / 60) * 100} className="h-3 mb-3" />
          <div className="flex items-center justify-center gap-2 text-foreground mb-5">
            <Timer className="h-5 w-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Debate Layout */}
        <div className="flex justify-between items-start space-x-8">
          {/* Opponent */}
          <div className="flex flex-col items-center gap-3 w-1/3">
            {figureImageUrl ? (
              <img src={figureImageUrl} alt="Opponent" className="w-48 h-60 object-contain rounded-xl" />
            ) : (
              <div className="w-48 h-60 bg-muted animate-pulse rounded-xl" />
            )}
            <p className="text-sm text-muted-foreground">Opponent (LLM)</p>
          </div>

          {/* Argument */}
          <div className="bg-muted rounded-[40px] px-8 py-6 w-1/3 text-center text-foreground leading-relaxed shadow-sm">
            {isLoading ? "Thinking..." : llmArgument}
          </div>

          {/* User */}
          <div className="flex flex-col items-center gap-3 w-1/3">
            {figureImageUrl ? (
              <img src={figureImageUrl} alt="You" className="w-48 h-60 object-contain rounded-xl" />
            ) : (
              <div className="w-48 h-60 bg-muted animate-pulse rounded-xl" />
            )}
            <p className="text-sm text-muted-foreground">You</p>

            {showUserOptions && (
              <div className="space-y-3 w-full max-w-sm mt-2">
                {userPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(index + 1)}
                    className={`w-full bg-muted rounded-2xl p-4 text-left transition-all duration-200 relative ${
                      selectedPrompt === index + 1
                        ? "ring-2 ring-primary shadow-md scale-[1.02]"
                        : "hover:bg-muted/80 hover:ring-1"
                    }`}
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-2">prompt #{index + 1}</p>
                    <p className="text-sm text-foreground leading-relaxed">{prompt}</p>
                    {selectedPrompt === index + 1 && (
                      <div className="absolute top-3 right-3">
                        <ThumbsUp className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DebateSwitch;
