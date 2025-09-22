import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Dashboard } from "./components/dashboard/Dashboard";
import { AuthPage } from "./components/auth/AuthPage";
import { WeatherPage } from "./pages/WeatherPage";
import { PestDiseasePage } from "./pages/PestDiseasePage";
import { FertilizerPage } from "./pages/FertilizerPage";
import { ModernFarmingPage } from "./pages/ModernFarmingPage";
import { FarmDiaryPage } from "./pages/FarmDiaryPage";
import { CropRecommenderPage } from "./pages/CropRecommenderPage";
import { FarmerGroupsPage } from "./pages/FarmerGroupsPage";
import { VirtualFarmPage } from "./pages/VirtualFarmPage";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { FieldCarePage } from "./pages/FieldCarePage";
import { CropSupportPage } from "./pages/CropSupportPage";
import { FarmManagementPage } from "./pages/FarmManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<AuthPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/pest-disease" element={<PestDiseasePage />} />
        <Route path="/fertilizer" element={<FertilizerPage />} />
        <Route path="/modern-farming" element={<ModernFarmingPage />} />
        <Route path="/farm-diary" element={<FarmDiaryPage />} />
        <Route path="/crop-recommender" element={<CropRecommenderPage />} />
        <Route path="/farmer-groups" element={<FarmerGroupsPage />} />
        <Route path="/virtual-farm" element={<VirtualFarmPage />} />
        <Route path="/field-care" element={<FieldCarePage />} />
        <Route path="/crop-support" element={<CropSupportPage />} />
        <Route path="/farm-management" element={<FarmManagementPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
