import React, { useContext, useState } from 'react';
import { Sparkles, Loader2, SlidersHorizontal } from 'lucide-react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { MuscleGroupsSVG } from './MuscleGroups';
import { WorkoutContext } from '@/pages/Index';
import { WorkoutTemplate } from "@/types/workout";
import { fetchAiWorkout } from "@/data/aiRequest";
import { getExerciseImageUrl } from '@/lib/utils';

interface AiNegotiationProps {
  onWorkoutGenerated: (workout: WorkoutTemplate) => void;
  onClose: () => void;
}

const AiNegotiation = ({ onWorkoutGenerated, onClose }: AiNegotiationProps) => {
  const { workoutRecommendation, setWorkoutRecommendation } = useContext(WorkoutContext);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState(3);
  const [description, setDescription] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);

  const handleGenerateWorkout = async () => {
    setIsLoading(true);
    try {
      const workout = await fetchAiWorkout(difficulty, description, selectedMuscles);
      setWorkoutRecommendation(workout);
      onWorkoutGenerated(workout);
      setIsAdjustOpen(false);
    } catch (error) {
      console.error('Failed to generate workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!workoutRecommendation) return null;

  return (
    <>
      <div className="flex flex-col h-full">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl">Workout Plan</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title */}
            <h2 className="text-2xl font-bold">{workoutRecommendation.title}</h2>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">About this workout</h3>
              <p className="text-muted-foreground">
                {workoutRecommendation.description}
              </p>
            </div>

            {/* Exercise List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Exercises</h3>
              <div className="space-y-3">
                {workoutRecommendation.exercises.map((exercise, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-card border"
                  >
                    <img
                      src={getExerciseImageUrl(exercise.name)}
                      alt={exercise.name}
                      className="w-16 h-16 rounded-lg object-cover grayscale brightness-75"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets.map((set, i) => (
                          <span key={i}>
                            {set.weight === 0 ? `${set.reps} reps` : `${set.reps}×${set.weight}kg`}
                            {i < exercise.sets.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-muted/40">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsAdjustOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Adjust Workout
            </Button>
            <Button onClick={() => onWorkoutGenerated(workoutRecommendation)}>
              Start Workout
            </Button>
          </div>
        </div>
      </div>

      {/* Adjust Workout Dialog */}
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adjust Workout</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Difficulty Slider */}
            <div className="space-y-4">
              <label className="text-sm font-medium">
                Difficulty Level: {difficulty}
              </label>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[difficulty]}
                onValueChange={([value]) => setDifficulty(value)}
                className="w-full"
              />
            </div>

            {/* Muscle Groups */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Target Muscles</label>
              <div className="h-[300px] border rounded-lg p-4 overflow-y-auto">
                <MuscleGroupsSVG 
                  selectedMuscles={selectedMuscles}
                  onMuscleClick={(muscle) => {
                    setSelectedMuscles(prev => 
                      prev.includes(muscle) 
                        ? prev.filter(m => m !== muscle)
                        : [...prev, muscle]
                    );
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Additional Details</label>
              <Textarea
                placeholder="Add any specific requirements or preferences..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdjustOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateWorkout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate New Plan
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiNegotiation;