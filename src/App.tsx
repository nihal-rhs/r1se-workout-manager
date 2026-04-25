import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useGlowStore } from "@/store/glowStore";
import { useAuth } from "./hooks/useAuth";
import { CloudSyncProvider } from "./components/CloudSyncProvider";
import React, { Suspense, useEffect } from "react";
import {
  TodaySkeleton,
  PlanSkeleton,
  ProgressSkeleton,
  HistorySkeleton,
  WorkoutListSkeleton,
  ExerciseListSkeleton,
} from "./components/PageSkeleton";

const Today = React.lazy(() => import('./pages/Today'));
const Plan = React.lazy(() => import('./pages/Plan'));
const Workouts = React.lazy(() => import('./pages/Workouts'));
const WorkoutPlan = React.lazy(() => import('./pages/WorkoutPlan'));
const Exercises = React.lazy(() => import('./pages/Exercises'));
const History = React.lazy(() => import('./pages/History'));
const CreateWorkout = React.lazy(() => import('./pages/CreateWorkout'));
const ActiveWorkout = React.lazy(() => import('./pages/ActiveWorkout'));
const Progress = React.lazy(() => import('./pages/Progress'));
const CoachDashboard = React.lazy(() => import('./pages/CoachDashboard'));
const ProgramBuilder = React.lazy(() => import('./pages/ProgramBuilder'));
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const ProgramDetail = React.lazy(() => import('./pages/ProgramDetail'));
const Messages = React.lazy(() => import('./pages/Messages'));
const CoachPublicProfile = React.lazy(() => import('./pages/CoachPublicProfile'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const AuthGate = React.lazy(() => import('./pages/AuthGate'));

const queryClient = new QueryClient();

const PageSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<Suspense fallback={<TodaySkeleton />}><Today /></Suspense>} />
    <Route path="/plan" element={<Suspense fallback={<PlanSkeleton />}><Plan /></Suspense>} />
    <Route path="/workouts" element={<Suspense fallback={<WorkoutListSkeleton />}><Workouts /></Suspense>} />
    <Route path="/workout-plan" element={<Suspense fallback={<PlanSkeleton />}><WorkoutPlan /></Suspense>} />
    <Route path="/exercises" element={<Suspense fallback={<ExerciseListSkeleton />}><Exercises /></Suspense>} />
    <Route path="/progress" element={<Suspense fallback={<ProgressSkeleton />}><Progress /></Suspense>} />
    <Route path="/history" element={<Suspense fallback={<HistorySkeleton />}><History /></Suspense>} />
    <Route path="/create-workout" element={<Suspense fallback={<WorkoutListSkeleton />}><CreateWorkout /></Suspense>} />
    <Route path="/workout/:workoutId" element={<Suspense fallback={<PageSpinner />}><ActiveWorkout /></Suspense>} />
    <Route path="/coach" element={<Suspense fallback={<PageSpinner />}><CoachDashboard /></Suspense>} />
    <Route path="/coach/program/new" element={<Suspense fallback={<PageSpinner />}><ProgramBuilder /></Suspense>} />
    <Route path="/coach/:coachId" element={<Suspense fallback={<PageSpinner />}><CoachPublicProfile /></Suspense>} />
    <Route path="/marketplace" element={<Suspense fallback={<PageSpinner />}><Marketplace /></Suspense>} />
    <Route path="/marketplace/:programId" element={<Suspense fallback={<PageSpinner />}><ProgramDetail /></Suspense>} />
    <Route path="/messages" element={<Suspense fallback={<PageSpinner />}><Messages /></Suspense>} />
    <Route path="*" element={<Suspense fallback={<PageSpinner />}><NotFound /></Suspense>} />
  </Routes>
);

const AppInner = () => {
  const glowEnabled = useGlowStore((s) => s.glowEnabled);
  const { user, loading } = useAuth();

  // Preload main route bundles after mount so navigation is instant
  useEffect(() => {
    const imports = [
      () => import('./pages/Today'),
      () => import('./pages/Plan'),
      () => import('./pages/Progress'),
      () => import('./pages/History'),
      () => import('./pages/Workouts'),
      () => import('./pages/Exercises'),
      () => import('./pages/WorkoutPlan'),
      () => import('./pages/Marketplace'),
    ];
    imports.forEach((imp, i) => {
      setTimeout(() => imp().catch(() => {}), i * 150);
    });
  }, []);

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className={`dark${glowEnabled ? ' glow-enabled' : ''}`}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {user ? <AuthenticatedRoutes /> : (
          <Suspense fallback={<PageSpinner />}>
            <AuthGate />
          </Suspense>
        )}
      </BrowserRouter>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CloudSyncProvider>
          <AppInner />
        </CloudSyncProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
