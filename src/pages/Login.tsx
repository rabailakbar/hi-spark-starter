import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-40px)] m-10 flex-col items-center justify-center bg-[#F8F1E7] rounded-2xl shadow-sm">
      <div className="flex flex-col items-center justify-center space-y-10 w-full max-w-xl text-center">
        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-semibold text-black whitespace-nowrap text-center">
          Is your algorithm your story?
        </h1>

        {/* Login Form */}
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="email">Enter Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full h-12 text-base bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#9C5FFF] border-none shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Enter password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full h-12 text-base bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#9C5FFF] border-none shadow-sm"
              />
            </div>
          </div>

          <Button
            className="bg-[#9C5FFF] hover:bg-[#8649e8] text-white px-6 py-3 rounded-md w-full text-base"
            size="lg"
            onClick={() => navigate("/dashboard")}
          >
            Login →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
