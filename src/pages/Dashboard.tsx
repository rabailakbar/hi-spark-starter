import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/supabase";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const BUCKET_NAME = "Thesis";
  const FOLDER_NAME = "Modules";

  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data } = await supabase.storage
      .from(BUCKET_NAME)
      .list("Modules", { limit: 100 });

    const urls = data.map((file) => {
      const url = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${FOLDER_NAME}/${file.name}`);
      return url;
    });
    setImageUrls(urls);
  };

  return (
    <div className="flex min-h-[calc(100vh-40px)] m-10 flex-col items-center justify-start bg-[#F8F1E7] rounded-2xl shadow-sm overflow-y-auto">
      {/* Make inner container fill width with 10% padding on each side */}
      <div className="w-full flex flex-col justify-between px-[10%] py-10 space-y-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-black">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#EDEDED] rounded-md transition-colors">
              <Code className="w-5 h-5 text-black" />
            </button>
            <button className="p-2 bg-[#EDEDED] rounded-full">
              <User className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="flex items-center justify-between bg-[#8B5CF6] text-white p-8 rounded-xl shadow-sm">
          {/* Div A - Heading + Text */}
          <div className="w-[80%] pr-6">
            <h1 className="text-3xl font-semibold mb-2">Welcome to askwhy!</h1>
            <p className="text-base opacity-90 leading-relaxed">
              A glow up for your brain. How does that sound? We’re here to help. Turn curiosity into your superpower.{" "}
              <strong>Play. Challenge. Ask Why.</strong> Let’s start your journey with us!
            </p>
          </div>

          {/* Div B - Button */}
          <div className="w-[20%] flex justify-center">
            <Button
              className="bg-[#5DDEDE] hover:bg-[#3fcf6c] text-black px-4 py-2 rounded-md text-sm"
              onClick={() => navigate("/M3")}
            >
              Click here to start →
            </Button>
          </div>
        </div>


        {/* All Modules - Phases Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-[#FF5A5F]">All Modules</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phase I */}
            <Card className="text-lg p-4 rounded-xl shadow-sm bg-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-center">Phase I: Awareness</h3>
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 p-3 bg-[#F1F5F9] rounded text-[#FF5A5F] text-center font-medium">M1</div>
                  <div className="flex-1 p-3 bg-[#F1F5F9] rounded text-[#FF5A5F] text-center font-medium">M2</div>
                </div>
              </div>

              {/* Bottom row: Difficulty + Progress */}
              <div className="flex items-center justify-between text-xs text-gray-600 mt-auto">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-300 rounded-full" /> {/* Placeholder icon */}
                  <span>Beginner Level</span>
                </div>
                <span>0/2 Done</span>
              </div>
            </Card>

            {/* Phase II */}
            <Card className="text-lg p-4 rounded-xl shadow-sm bg-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-center">Phase II: Logical Reasoning</h3>
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 p-3 bg-[#F1F5F9] rounded text-[#FF5A5F] text-center font-medium">M3</div>
                  <div className="flex-1 p-3 bg-[#F1F5F9] rounded text-[#FF5A5F] text-center font-medium">M4</div>
                  <div className="flex-1 p-3 bg-[#F1F5F9] rounded text-[#FF5A5F] text-center font-medium">M5</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 mt-auto">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-300 rounded-full" /> {/* Placeholder icon */}
                  <span>Intermediate Level</span>
                </div>
                <span>0/3 Done</span>
              </div>
            </Card>

            {/* Phase III */}
            <Card className="text-lg p-4 rounded-xl shadow-sm bg-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-center">Phase III: Accepting Diversity</h3>
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 p-3 bg-[#F1F5F9] rounded text-[#FF5A5F] text-center font-medium">M6</div>
                  <div className="flex-1 p-3 bg-[#F1F5F9] rounded text-[#FF5A5F] text-center font-medium">M7</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 mt-auto">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-300 rounded-full" /> {/* Placeholder icon */}
                  <span>Hard Level</span>
                </div>
                <span>0/2 Done</span>
              </div>
            </Card>
          </div>
        </div>


        {/* All Modules - Cards Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-[#FF5A5F]">All Modules</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Find your vibe */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/interest")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/find-your-vibe.svg" 
                  alt="Find your vibe" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Find your vibe</h4>
              <p className="text-sm text-gray-600 mb-2">Let's help you build your feed!</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟣 Beginner Level</span>
                <span>🕒 2 min</span>
              </div>
            </Card>

            {/* Pick & Flick */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/pick-and-flick?id=M2&name=Pick%20%26%20Flick")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="flex gap-2 mb-2">
                    <div className="w-12 h-8 bg-purple-400 rounded"></div>
                    <div className="w-12 h-8 bg-red-400 rounded"></div>
                    <div className="w-12 h-8 bg-cyan-400 rounded"></div>
                  </div>
                  <div className="text-xs text-gray-600">Pick & Flick</div>
                </div>
              </div>
              <h4 className="font-semibold text-base mb-1">Pick & Flick</h4>
              <p className="text-sm text-gray-600 mb-2">Like and save social media posts!</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟣 Beginner Level</span>
                <span>🕒 2 min</span>
              </div>
            </Card>

            {/* Bias Quiz */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/bias-quiz?id=M3&name=Bias%20Detection")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/bias-detection.svg" 
                  alt="Bias Detection" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Bias Detection</h4>
              <p className="text-sm text-gray-600 mb-2">Identify biased language in headlines</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟡 Intermediate Level</span>
                <span>🕒 5 min</span>
              </div>
            </Card> 

            {/* Connect Dots
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/connect-dots?id=M4&name=Connect%20Dots")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3" />
              <h4 className="font-semibold text-base mb-1">Connect Dots</h4>
              <p className="text-sm text-gray-600 mb-2">Critical thinking quiz challenge</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟡 Intermediate Level</span>
                <span>🕒 5 min</span>
              </div>
            </Card> */}

            {/* Social Posts Analysis */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/social-posts?id=M5&name=Social%20Analysis")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/social-analysis.svg" 
                  alt="Social Analysis" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Social Analysis</h4>
              <p className="text-sm text-gray-600 mb-2">Analyze social media credibility</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟢 Advanced Level</span>
                <span>🕒 3 min</span>
              </div>
            </Card>

            {/* Quiz Module
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/quiz")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3" />
              <h4 className="font-semibold text-base mb-1">General Quiz</h4>
              <p className="text-sm text-gray-600 mb-2">Test your media literacy skills</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟡 Intermediate Level</span>
                <span>🕒 10 min</span>
              </div>
            </Card> */}

            {/* Fake or Fact Game */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/fake-or-fact?id=M6&name=Fake%20or%20Fact")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/fake-or-fact.svg" 
                  alt="Fake or Fact" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Fake or Fact?</h4>
              <p className="text-sm text-gray-600 mb-2">Spot fake images and content!</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟢 Advanced Level</span>
                <span>🕒 5 min</span>
              </div>
            </Card>

            {/* Behind the Buzz */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/behind-the-buzz?id=M3&name=Behind%20the%20Buzz")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/behind-the-buzz.svg" 
                  alt="Behind the Buzz" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Behind the Buzz</h4>
              <p className="text-sm text-gray-600 mb-2">Analyze viral content motivations!</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟡 Intermediate Level</span>
                <span>🕒 2 min</span>
              </div>
            </Card>

            {/* Debate Switch */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/debate-switch?id=M6&name=Debate%20Switch")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/debate-switch.svg" 
                  alt="Debate Switch" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Debate Switch</h4>
              <p className="text-sm text-gray-600 mb-2">Argue both sides of controversial topics!</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🔴 Advanced Level</span>
                <span>🕒 2 min</span>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
