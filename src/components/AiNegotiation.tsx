import React, { useEffect, useState, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MuscleGroupsSVG } from './MuscleGroups';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { fetchAiWorkout, Exercise, WorkoutResponse } from "@/data/aiRequest";
import { getExerciseImageUrl } from '@/lib/utils';
import { WorkoutContext } from '@/pages/Index';

interface AiNegotiationProps {
  onSelectionChange?: (selectedMuscles: string[]) => void;
  className?: string;
}

const AiNegotiation: React.FC<AiNegotiationProps> = ({ onSelectionChange, className }) => {
  const { workoutRecommendation, setWorkoutRecommendation } = useContext(WorkoutContext);
  if (!workoutRecommendation)
    return null;

  const [defaultWorkoutRecommendation] = useState<WorkoutResponse>({...workoutRecommendation});
  const [workoutTitle, setWorkoutTitle] = useState<string>(workoutRecommendation.title);
  const [explainerText, setExplainerText] = useState<string>(workoutRecommendation.description);
  const [recommendedWorkouts, setRecommendedExercises] = useState<Exercise[]>(workoutRecommendation.exercises);
  const [difficulty, setDifficulty] = useState<number>(3);
  const [requestText, setRequestText] = useState<string>('');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  useEffect(() => {
    if (workoutRecommendation) {
      console.log("setting", workoutRecommendation, defaultWorkoutRecommendation);
      setWorkoutTitle(workoutRecommendation.title);
      setExplainerText(workoutRecommendation.description);
      setRecommendedExercises(workoutRecommendation.exercises);
    }
  }, [workoutRecommendation]);

  const handleMuscleToggle = (muscleId: string) => {
    const newSelection = selectedMuscles.includes(muscleId)
      ? selectedMuscles.filter(id => id !== muscleId)
      : [...selectedMuscles, muscleId];

    setSelectedMuscles(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleMuscleHover = (muscleId: string | null) => {
    setHoveredMuscle(muscleId);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Design Your Workout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-2xl font-bold">
              {workoutTitle}
            </label>
          </div>

          {/* Explainer Text */}
          <div className="space-y-2">
            <label className="text-xl font-medium">
              We chose this workout for you because...
            </label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="This is a personalized workout for..."
              value={explainerText}
              onChange={(e) => setExplainerText(e.target.value)}
              readOnly={true}
            />
          </div>

          {/* Recommended Exercises */}
          <div className="space-y-2">
            <label className="text-xl font-bold">
              Recommended Exercises
            </label>
            <ul className="space-y-2">
              {recommendedWorkouts.map((workout, index) => (
                <li
                  key={index}
                  className="p-3 border rounded-md bg-background hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img
                        src={getExerciseImageUrl(workout.name)}
                        alt={workout.name}
                        className="w-16 h-16 rounded-lg object-cover grayscale brightness-75"
                      />
                      <span className="font-medium">{workout.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {workout.sets.map((set, i) => (
                        <span key={i}>
                          {set.weight === 0 ? `${set.reps}x` : `${set.reps}x${set.weight}kg`}
                          {i < workout.sets.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Difficulty slider */}
          <div className="space-y-2">
            <label htmlFor="difficulty" className="text-xl font-medium">
              Difficulty Level
            </label>
            <input
              type="range"
              id="difficulty"
              min="1"
              max="5"
              className="w-full h-8 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 touch-manipulation"
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none'
              }}
            />
            <style>{`
              input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 32px;
                height: 32px;
                background: white;
                border-radius: 50%;
                border: 2px solid currentColor;
                cursor: pointer;
                margin-top: -12px;
              }
              input[type=range]::-moz-range-thumb {
                width: 32px;
                height: 32px;
                background: white;
                border-radius: 50%;
                border: 2px solid currentColor;
                cursor: pointer;
              }
            `}</style>
          </div>

          {/* Request Text */}
          <div className="space-y-2">
            <label className="text-xl font-medium">
              Workout Description
            </label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="Describe any specific requirements or preferences for your workout"
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
            />
          </div>

          <div className="flex w-[400px]">
            <div className="flex flex-col">
              <label className="text-xl font-medium mb-2">
                Focus on muscle groups...
              </label>
              <MuscleGroupsSVG
                selectedMuscles={selectedMuscles}
                hoveredMuscle={hoveredMuscle}
                onMuscleClick={handleMuscleToggle}
                onMuscleHover={handleMuscleHover}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 font-bold text-lg"
                >
                  Reset
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Reset All Settings</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to reset all settings to default? This will clear your selected muscles, difficulty level, and workout description.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setWorkoutRecommendation({...defaultWorkoutRecommendation});
                        setDifficulty(3);
                        setRequestText('');
                        setSelectedMuscles([]);
                      }}
                    >
                      Reset to Default AI Workout
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              className="px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 font-bold text-lg"
              onClick={() => {
                fetchAiWorkout(difficulty, explainerText, selectedMuscles)
                  .then((workout) => {
                    setWorkoutTitle(workout.title);
                    setExplainerText(workout.description);
                    setRecommendedExercises(workout.exercises);
                    setWorkoutRecommendation(workout);
                  }
                  );
              }}
            >
              New AI Workout
            </button>
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-bold text-lg"
              onClick={() => {/* Add confirm handler */ }} // TODO
            >
              Confirm & Edit
            </button>

            <button
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-bold text-lg"
              onClick={() => {/* Add confirm handler */ }} // TODO
            >
              Confirm
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiNegotiation;