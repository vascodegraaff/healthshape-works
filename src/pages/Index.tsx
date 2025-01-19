import { useState, useEffect, createContext } from "react";
import { Calendar, ChevronRight, Plus, Zap } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import WorkoutCard from "@/components/WorkoutCard";
import WorkoutDetail from "@/components/WorkoutDetail";
import ActiveWorkout from "@/components/ActiveWorkout";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { WorkoutTemplate, WorkoutSession, Exercise, ActiveExercise } from "@/types/workout";
import { generateId } from "@/lib/utils";
import { syncManager } from "@/lib/syncManager";
import { workoutTemplates } from "@/data/workoutTemplates";
import Timer from "@/components/Timer";
import AiWorkoutSection from "@/components/AiWorkoutSection";
import { workoutService } from "@/services/workoutService";
import { fetchAiWorkout, WorkoutResponse } from "@/data/aiRequest";
import { useAuth } from '@/contexts/AuthContext';

interface WorkoutContext {
  workoutRecommendation: WorkoutResponse | null;
  setWorkoutRecommendation: (workout: WorkoutResponse | null) => void;
}

export const WorkoutContext = createContext<WorkoutContext>({
  workoutRecommendation: null,
  setWorkoutRecommendation: () => { },
});

const getMotivationalQuote = () => {
  const quotes = [
    // "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    // "Success starts with self-discipline.",
    // "The harder you work, the better you get.",
    // "Small progress is still progress.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

const Index = () => {
  const { user } = useAuth();
  const [workoutRecommendation, setWorkoutRecommendation] = useState(null);
  const [username] = useState("Fitness Enthusiast");
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutTemplate | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [templates, setTemplates] = useState(workoutTemplates);
  const [isWorkoutMinimized, setIsWorkoutMinimized] = useState(false);

  // Load active workout on mount
  useEffect(() => {
    const saved = storage.getActiveWorkout();
    // Only restore if it exists and is not completed
    if (saved && !saved.completed_at) {
      setActiveWorkout(saved);
    } else {
      // Clear storage if workout exists but is completed
      storage.clearActiveWorkout();
      setActiveWorkout(null);
    }
  }, []);

  // Auto-save active workout
  useEffect(() => {
    if (!activeWorkout) return;

    const saveInterval = setInterval(() => {
      storage.saveActiveWorkout(activeWorkout);
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(saveInterval);
  }, [activeWorkout]);

  // Add useEffect to fetch the workout
  useEffect(() => {
    setWorkoutRecommendation
    const fetchWorkout = async () => {
      const workout = await fetchAiWorkout(3, "Today we will focus on chest and quads since you've been slacking on them lately.", ["chest", "quadriceps"]);
      setWorkoutRecommendation(workout);
    };
    fetchWorkout();
  }, []);

  const handleWorkoutClick = (workout: WorkoutTemplate) => {
    setSelectedWorkout(workout);
  };

  const handleCloseWorkoutDetail = () => {
    setSelectedWorkout(null);
  };

  const handleStartWorkout = () => {
    if (!selectedWorkout || !user) return;

    // Convert template exercises to active exercises
    const activeExercises: ActiveExercise[] = selectedWorkout.exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      force: "push",
      level: "beginner",
      mechanic: null,
      equipment: null,
      primaryMuscles: [exercise.target_muscle],
      secondaryMuscles: [],
      instructions: [],
      category: "strength",
      images: [`${exercise.id}/0.jpg`],
      sets: Array(exercise.sets || 3).fill({
        weight: 0,
        reps: 0,
        completed: false
      })
    }));

    const newWorkout: WorkoutSession = {
      user_id: user.id,
      template_id: selectedWorkout.id,
      title: selectedWorkout.title,
      started_at: new Date(),
      completed_at: null,
      exercises: activeExercises
    };

    setActiveWorkout(newWorkout);
    storage.saveActiveWorkout(newWorkout);
    setSelectedWorkout(null);
    setIsWorkoutMinimized(false);
  };

  const handleFinishWorkout = async () => {
    // if (!activeWorkout) return;

    try {
      await workoutService.saveWorkout(activeWorkout);
      // Clear storage first
      storage.clearActiveWorkout();
      // Then update state
      setActiveWorkout(null);
      setIsWorkoutMinimized(true);
    } catch (error) {
      console.error('Failed to save workout:', error);
      // Add to sync queue if failed
      storage.addToSyncQueue({
        id: generateId(),
        type: 'workout_session',
        data: activeWorkout,
      });
      // Even if save fails, we should still clear the active workout
      storage.clearActiveWorkout();
      setActiveWorkout(null);
      setIsWorkoutMinimized(false);
    }
  };

  const handleStartEmptyWorkout = () => {
    if (!user) return;

    const newWorkout: WorkoutSession = {
      user_id: user.id,
      template_id: null,
      title: "Quick Workout",
      started_at: new Date(),
      completed_at: null,
      exercises: []  // Start with empty exercises array
    };

    setActiveWorkout(newWorkout);
    storage.saveActiveWorkout(newWorkout);
    setIsWorkoutMinimized(false);
  };

  const handleAiWorkoutStart = (workout: WorkoutSession) => {
    setActiveWorkout(workout);
    storage.saveActiveWorkout(workout);
    setIsWorkoutMinimized(false);
  };

  // Add cleanup effect
  useEffect(() => {
    return () => {
      // Clean up any completed workouts from storage when component unmounts
      const saved = storage.getActiveWorkout();
      if (saved?.completed_at) {
        storage.clearActiveWorkout();
      }
    };
  }, []);

  return (
    <>
      <div className="min-h-screen pb-20">
        <div className="container px-4 py-6">
          {/* Header */}
          {/* <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-white opacity-80">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">0</span>
              <div className="w-6 h-6 bg-white/20 rounded-full" />
            </div>
          </div> */}

          {/* Welcome Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-emerald-400" />
              <span className="text-lg font-semibold text-emerald-400">Motions</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back!
            </h1>
            <p className="text-white/80 text-sm italic">
              {getMotivationalQuote()}
            </p>
          </div>

          {/* AI Curated Section */}
          <WorkoutContext.Provider value={{ workoutRecommendation, setWorkoutRecommendation }}>
            <AiWorkoutSection onWorkoutClick={handleAiWorkoutStart} />
          </WorkoutContext.Provider>

          {/* Quick Empty Workout */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleStartEmptyWorkout}
            >
              <Plus className="w-4 h-4" />
              Start Empty Workout
            </Button>
          </div>

          {/* Templates Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Templates</h2>
            <div className="space-y-4">
              {templates.map((workout, index) => (
                <WorkoutCard
                  key={index}
                  {...workout}
                  onClick={() => handleWorkoutClick(workout)}
                />
              ))}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>

      {/* Workout Detail Sheet */}
      {selectedWorkout && !activeWorkout && (
        <WorkoutDetail
          title={selectedWorkout.title}
          exercises={selectedWorkout.exercises.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            force: "push",
            level: "beginner",
            mechanic: null,
            equipment: null,
            primaryMuscles: [exercise.target_muscle],
            secondaryMuscles: [],
            instructions: [],
            category: "strength",
            images: [`${exercise.id}/0.jpg`]
          }))}
          lastPerformed="5 May 2024"
          onClose={handleCloseWorkoutDetail}
          onStartWorkout={handleStartWorkout}
        />
      )}

      {/* Active Workout Sheet */}
      {activeWorkout && !isWorkoutMinimized && (
        <ActiveWorkout
          title={activeWorkout.title}
          exercises={activeWorkout.exercises}
          startTime={activeWorkout.started_at}
          onFinish={handleFinishWorkout}
          onClose={() => setActiveWorkout(null)}
          onMinimize={() => setIsWorkoutMinimized(true)}
        />
      )}

      {/* Minimized Workout Indicator */}
      {activeWorkout && isWorkoutMinimized && (
        <div
          className="fixed bottom-20 left-4 right-4 bg-card p-4 rounded-lg shadow-lg cursor-pointer"
          onClick={() => setIsWorkoutMinimized(false)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{activeWorkout.title}</h3>
              <Timer startTime={activeWorkout.started_at} />
            </div>
            <Button variant="ghost" size="sm" className="text-accent">
              Resume
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;