import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DocumentHandoverSystem from "./components/DocumentHandoverSystem";
import DocumentTakeOverSystem from "./components/DocumentTakeOverSystem";
import BatchGeneratorDef from "./components/BatchGeneratorDef";
import BatchGeneratorDefView from "./components/BatchGeneratorDefView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/HandOver" element={<DocumentHandoverSystem/>} />
          <Route path="/TakeOver" element={<DocumentTakeOverSystem/>} />
          <Route path="/BatchGenDef" element={<BatchGeneratorDef/>} />
          <Route path="/batchGenerationView" element={<BatchGeneratorDefView/>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
