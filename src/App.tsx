import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Landing from "./pages/Landing.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminList from "./pages/AdminList.tsx";
import AdminEditor from "./pages/AdminEditor.tsx";
import AdminVisibility from "./pages/AdminVisibility.tsx";
import AdminHistory from "./pages/AdminHistory.tsx";
import { AdminGate } from "./components/AdminGate.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/p/:slug" element={<Landing />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminGate><AdminList /></AdminGate>} />
          <Route path="/admin/admin" element={<AdminGate><AdminVisibility /></AdminGate>} />
          <Route path="/admin/historik" element={<AdminGate><AdminHistory /></AdminGate>} />
          <Route path="/admin/new" element={<AdminGate><AdminEditor /></AdminGate>} />
          <Route path="/admin/:slug" element={<AdminGate><AdminEditor /></AdminGate>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
