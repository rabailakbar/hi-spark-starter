import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-40px)] m-10 flex-col items-center justify-center bg-[#F8F1E7] rounded-2xl shadow-sm">
      <div className="flex flex-col items-center justify-center space-y-10 w-full max-w-xl text-center">
        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-semibold text-black whitespace-nowrap text-center">
          Is your algorithm your story?
        </h1>

        {/* Video Placeholder */}
        <div className="w-[300px] h-[180px] md:w-[480px] md:h-[270px] bg-[#F9FAFB] rounded-xl shadow-sm flex items-center justify-center">
          <div className="w-10 h-10 bg-teal-200 rounded-md" />
        </div>

        {/* Button */}
        <Button
          className="bg-[#9C5FFF] hover:bg-[#8649e8] text-white px-6 py-2 rounded-md"
          onClick={() => navigate("/login")}
        >
          Let’s find out →
        </Button>
      </div>
    </div>
  );
};

export default Index;
