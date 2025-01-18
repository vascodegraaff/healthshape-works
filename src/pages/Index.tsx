import { useState, useEffect } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import WorkoutCard from "@/components/WorkoutCard";
import WorkoutDetail from "@/components/WorkoutDetail";
import ActiveWorkout from "@/components/ActiveWorkout";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { WorkoutTemplate, WorkoutSession } from "@/types/workout";
import { generateId } from "@/lib/utils";
import { syncManager } from "@/lib/syncManager";
import { workoutTemplates } from "@/data/workoutTemplates";
import Timer from "@/components/Timer";
import AiWorkoutSection from "@/components/AiWorkoutSection";

const Index = () => {
  const [username] = useState("Fitness Enthusiast");
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutTemplate | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [templates, setTemplates] = useState(workoutTemplates);
  const [isWorkoutMinimized, setIsWorkoutMinimized] = useState(false);

  // Load active workout on mount
  useEffect(() => {
    const saved = storage.getActiveWorkout();
    if (saved) setActiveWorkout(saved);
  }, []);

  // Auto-save active workout
  useEffect(() => {
    if (!activeWorkout) return;

    const saveInterval = setInterval(() => {
      storage.saveActiveWorkout(activeWorkout);
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(saveInterval);
  }, [activeWorkout]);

  const handleWorkoutClick = (workout: WorkoutTemplate) => {
    setSelectedWorkout(workout);
  };

  const handleStartWorkout = () => {
    if (!selectedWorkout) return;

    const newWorkout: WorkoutSession = {
      id: generateId(),
      user_id: "user_id",
      template_id: selectedWorkout.id,
      title: selectedWorkout.title,
      description: selectedWorkout.description,
      created_at: selectedWorkout.created_at,
      updated_at: selectedWorkout.updated_at,
      duration: selectedWorkout.duration,
      tags: selectedWorkout.tags,
      intensity: selectedWorkout.intensity,
      thumbnails: selectedWorkout.thumbnails,
      started_at: new Date(),
      exercises: selectedWorkout.exercises.map(exercise => ({
        ...exercise,
        sets: Array(exercise.sets.length).fill({
          weight: 0,
          reps: 0,
          completed: false,
        }),
      })),
    };

    setActiveWorkout(newWorkout);
    storage.saveActiveWorkout(newWorkout);
    setSelectedWorkout(null);
    setIsWorkoutMinimized(false);
  };

  const handleFinishWorkout = async () => {
    if (!activeWorkout) return;

    const finishedWorkout = {
      ...activeWorkout,
      completed_at: new Date(),
    };

    try {
      // Try to sync immediately
      await syncManager.syncWorkoutSession(finishedWorkout);
      storage.clearActiveWorkout();
    } catch (error) {
      // Add to sync queue if failed
      storage.addToSyncQueue({
        id: generateId(),
        type: 'workout_session',
        data: finishedWorkout,
      });
    }

    setActiveWorkout(null);
  };

  return (
    <>
      <div className="min-h-screen pb-20">
        <div className="container px-4 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-white opacity-80">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">0</span>
              <div className="w-6 h-6 bg-white/20 rounded-full" />
            </div>
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Hi, {username}!
            </h1>
            <p className="text-white/80">Choose your workout intensity for today</p>
          </div>

          {/* AI Curated Section */}
          <AiWorkoutSection onWorkoutClick={handleWorkoutClick} />

          {/* Regular Workout Cards */}
          <div className="space-y-4">
            {templates.map((workout) => (
              <WorkoutCard
                key={workout.id}
                {...workout}
                onClick={() => handleWorkoutClick(workout)}
              />
            ))}
          </div>

          {/* Custom Workout Button */}
          <Button
            variant="secondary"
            className="w-full mt-6 bg-white/10 text-white hover:bg-white/20"
            onClick={() => console.log("Custom workout clicked")}
          >
            <span>Custom workout</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>

          {/* Goals Section */}
          <div className="mt-8 bg-white/10 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">Get a Strength Goal</h3>
                <p className="text-white/80 text-sm">Complete 2 Gym workouts</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <BottomNav />
      </div>

      {selectedWorkout && !activeWorkout && (
        <WorkoutDetail
          title={selectedWorkout.title}
          exercises={[
            {
              name: "Incline Bench Press (Barbell)",
              sets: 3,
              targetMuscle: "Chest",
              image: "https://example.com/bench-press.jpg",
            },
            {
              name: "Seated Overhead Press (Dumbbell)",
              sets: 3,
              targetMuscle: "Shoulders",
              image: "https://example.com/overhead-press.jpg",
            },
            {
              name: "Chest Fly",
              sets: 3,
              targetMuscle: "Chest",
              image: "https://example.com/chest-fly.jpg",
            },
          ]}
          lastPerformed="5 May 2024"
          onClose={handleFinishWorkout}
          onStartWorkout={handleStartWorkout}
        />
      )}

      {activeWorkout && !isWorkoutMinimized && (
        <ActiveWorkout
          title={activeWorkout.title}
          exercises={activeWorkout.exercises}
          startTime={activeWorkout.started_at}
          onFinish={handleFinishWorkout}
          onClose={handleFinishWorkout}
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