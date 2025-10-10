import { ModuleCard } from "@/components/ModuleCardcopy";
import { useNavigate } from "react-router-dom";

const Indexcopy = () => {
  const navigate = useNavigate();
  
  const handleStart = () => {
    navigate("/debate");
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <ModuleCard
        phase="Phase III"
        moduleNumber="M6"
        title="Module 6: Burst the bubble"
        description="In this module, students engage in a structured debate through prompt selection with the platform's pre-existing users. To lower their polarization score, they must choose and defend the strongest arguments for their assigned position. After 60 seconds, the roles switch, and students must argue against the very stance they just defended. This exercise encourages perspective-shifting, empathy, and critical reasoning."
        difficulty="Hard Level"
        hasTimer={true}
        hasScoring={true}
        onStart={handleStart}
      />
    </main>
  );
};

export default Indexcopy;
