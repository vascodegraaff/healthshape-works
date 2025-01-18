import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {MuscleGroups, MuscleGroupsSVG} from './MuscleGroups';
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


interface AiNegotiationProps {
  onSelectionChange?: (selectedMuscles: string[]) => void;
}

/*
{
"title": "Medium Workout",
    "description": "A 45-minute medium workout targeting chest, biceps, and back muscles.",
    "exercises": [
        {
            "name": "Dumbbell Bench Press with Neutral Grip",
            "target_muscle": "chest",
            "order": 1,
            "sets": [
                {
                    "weight": 20,
                    "reps": 8
                },
*/
// import { getExerciseImageUrl } from "@/lib/utils";
// const recommendedExercises: [
//   {
//     id: "Alternating_Kettlebell_Press",
//     name: "Alternating Kettlebell Press",
//     target_muscle: "shoulders",
//     sets: 4,
//     order: 0,
//     image_url: getExerciseImageUrl("Alternating_Kettlebell_Press"),
//   },
//   {
//     id: "Alternate_Hammer_Curl",
//     name: "Alternate Hammer Curl",
//     target_muscle: "biceps",
//     sets: 3,
//     order: 1,
//     image_url: getExerciseImageUrl("Alternate_Hammer_Curl"),
//   },
//   {
//     id: "Alternating_Floor_Press",
//     name: "Alternating Floor Press",
//     target_muscle: "chest",
//     sets: 3,
//     order: 2,
//     image_url: getExerciseImageUrl("Alternating_Floor_Press"),
//   },
// ];

const AiNegotiation: React.FC<AiNegotiationProps> = ({ onSelectionChange }) => {
  const [difficulty, setDifficulty] = useState<number>(3);
  const [explainerText, setExplainerText] = useState<string>('');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

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
    <Card className="">
      <CardHeader>
        <CardTitle>Design Your Workout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="difficulty" className="text-sm font-medium">
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
            <style jsx>{`
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

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Workout Description
            </label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="Describe any specific requirements or preferences for your workout"
              value={explainerText}
              onChange={(e) => setExplainerText(e.target.value)}
            />
          </div>

          <div className="flex w-[400px]">
            <MuscleGroupsSVG
              selectedMuscles={selectedMuscles}
              hoveredMuscle={hoveredMuscle}
              onMuscleClick={handleMuscleToggle}
              onMuscleHover={handleMuscleHover}
            />
          </div>

          <div className="space-y-2">
            <label className="text-2xl font-bold">
              Recommended Workouts
            </label>
            <ul className="space-y-2">
              {/* {recommendedWorkouts.map((workout, index) => (
                <li 
                  key={index}
                  className="p-3 border rounded-md bg-background hover:bg-muted/50 cursor-pointer"
                >
                  {workout}
                </li>
              ))} */}
            </ul>
          </div>

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
                        setSelectedMuscles([]);
                        setDifficulty(3);
                        setExplainerText('');
                      }}
                    >
                      Reset to Default AI Workout
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-bold text-lg"
              onClick={() => {
                console.log({
                  difficulty: difficulty,
                  description: explainerText,
                  selectedMuscles
                });
              }}
            >
              New AI Workout
            </button>
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-bold text-lg"
              onClick={() => {/* Add confirm handler */}}
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