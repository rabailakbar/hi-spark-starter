import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ModuleCard from "@/components/ModuleCard";
import { Skeleton } from "@/components/ui/skeleton";

const Indexx = () => {
  const { moduleNumber } = useParams();
  const currentPath = window.location.pathname;
  const moduleToFetch = currentPath === "/M5" ? "M5" : moduleNumber || "M3";

  const { data: module, isLoading } = useQuery({
    queryKey: ["module", moduleToFetch],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("module_number", moduleToFetch)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Soft blurred background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-muted rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary rounded-full blur-3xl opacity-20" />
      </div>

      {isLoading ? (
        <Skeleton className="w-full max-w-4xl h-96" />
      ) : module ? (
        <ModuleCard module={module} />
      ) : (
        <div className="text-center text-muted-foreground">Module not found</div>
      )}
    </div>
  );
};

export default Indexx;
