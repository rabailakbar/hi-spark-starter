import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Module from "./pages/Module";
import Exercise from "./pages/Exercise";
import Interest from "./pages/Interest";
import NotFound from "./pages/NotFound";
import DebateModule from "./pages/DebateModule";
import DebateSwitch from "./pages/DebateSwitch";
import InTheirShoes from "./pages/InTheirShoes";
import Quiz from "./pages/Quiz";
import Indexx from "./pages/Indexcopy";
import Indexcopy from "./pages/Index-copy";
import PickAndFlickPage from "./pages/PickAndFlickPage";
import BiasQuizPage from "./pages/BiasQuizPage";
import ConnectDotsPage from "./pages/ConnectDotsPage";
import SocialPostPage from "./pages/SocialPostPage";
import FakeOrFactPage from "./pages/FakeOrFactPage";
import BehindTheBuzzPage from "./pages/BehindTheBuzzPage";
import DebateSwitchPage from "./pages/DebateSwitchPage";



const queryClient = new QueryClient();

const App = () => (


  
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/module" element={<Module />} />
          <Route path="/interest" element={<Interest />} />
          <Route path="/exercise" element={<Exercise />} />
          {/* Component-specific routes */}
          <Route path="/pick-and-flick" element={<PickAndFlickPage />} />
          <Route path="/bias-quiz" element={<BiasQuizPage />} />
          <Route path="/connect-dots" element={<ConnectDotsPage />} />
          <Route path="/social-posts" element={<SocialPostPage />} />
          <Route path="/fake-or-fact" element={<FakeOrFactPage />} />
          <Route path="/behind-the-buzz" element={<BehindTheBuzzPage />} />
          <Route path="/debate-switch" element={<DebateSwitchPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
         
         
          <Route path="/module/:moduleNumber" element={<Indexx />} />
          <Route path="/M3" element={<Indexx />} />
          <Route path="/quiz" element={<Quiz />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/M4" element={<Indexx />} />
          <Route path= "/M5" element = {<Indexx/>}/>
          <Route path="/debate" element={<DebateModule />} />
          <Route path="/debate/switch" element={<DebateSwitch />} />
          <Route path="/debate/final" element={<InTheirShoes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
