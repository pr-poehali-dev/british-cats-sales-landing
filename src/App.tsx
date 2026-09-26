import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Course from "./pages/Course";
import Corporate from "./pages/Corporate";
import About from "./pages/About";
import SergeyChernikov from "./pages/SergeyChernikov";
import ReviewsPage from "./pages/ReviewsPage";
import FromZero from "./pages/FromZero";
import IncomePage from "./pages/Income";
import NotFound from "./pages/NotFound";
import { CabinetAuthProvider } from "./contexts/CabinetAuth";
import RequireAuth from "./components/cabinet/RequireAuth";
import Login from "./pages/cabinet/Login";
import StudentHome from "./pages/cabinet/StudentHome";
import ProfileSetup from "./pages/cabinet/ProfileSetup";
import AdminHome from "./pages/cabinet/AdminHome";
import AdminCodes from "./pages/cabinet/AdminCodes";
import "./styles/cabinet.css";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <CabinetAuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/course" element={<Course />} />
          <Route path="/corporate" element={<Corporate />} />
          <Route path="/about" element={<About />} />
          <Route path="/sergey-chernikov" element={<SergeyChernikov />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/neyroseti-s-nulya" element={<FromZero />} />
          <Route path="/zarabotok-na-neyrosetyah" element={<IncomePage />} />

          <Route path="/cabinet/login" element={<Login />} />
          <Route path="/cabinet/setup" element={<RequireAuth role="student"><ProfileSetup /></RequireAuth>} />
          <Route path="/cabinet" element={<RequireAuth role="student"><StudentHome /></RequireAuth>} />
          <Route path="/cabinet/admin" element={<RequireAuth role="admin"><AdminHome /></RequireAuth>} />
          <Route path="/cabinet/admin/codes" element={<RequireAuth role="admin"><AdminCodes /></RequireAuth>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </CabinetAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;