
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SplineBackground } from "./components/SplineBackground";
import SecurityTools from "./pages/SecurityTools";

// Wrapper component to conditionally render the SplineBackground
const AppContent = () => {
  const location = useLocation();
  const showGlobalBackground = location.pathname !== "/security";
  
  return (
    <>
      {showGlobalBackground && <SplineBackground />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/security" element={<SecurityTools />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

function App() {
  // Create a client instance that persists across renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
