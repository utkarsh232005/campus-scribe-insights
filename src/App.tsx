
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import ReportSubmission from "./pages/ReportSubmission";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Departments from "./pages/Departments";
import NotFound from "./pages/NotFound";
import Faculty from "./pages/Faculty";
import Awards from "./pages/Awards";
import Analysis from "./pages/Analysis";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/submit-report" element={<ReportSubmission />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
