import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";
import { ExerciseDefinition } from "@/types/workout";
import { useState } from "react";
import { getExerciseImageUrl } from "@/lib/utils";

interface WorkoutDetailProps {
  title: string;
  exercises: ExerciseDefinition[];
  onClose: () => void;
  onStartWorkout: () => void;
  lastPerformed?: string;
}

const WorkoutDetail = ({ title, exercises, onClose, onStartWorkout, lastPerformed }: WorkoutDetailProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[90vh]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>

          {/* Last performed */}
          {lastPerformed && (
            <p className="text-sm text-muted-foreground mb-6">
              Last performed: {lastPerformed}
            </p>
          )}

          {/* Exercise list */}
          <div className="flex-1 overflow-auto">
            {exercises.map((exercise, index) => (
              <div key={index} className="py-4 border-t first:border-t-0">
                <div className="flex items-center gap-4">
                  <img
                    src={getExerciseImageUrl(exercise.id)}
                    alt={exercise.name}
                    className="w-20 h-20 rounded-lg object-cover grayscale brightness-75"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.primaryMuscles.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6">
            <Button 
              className="w-full bg-accent hover:bg-accent/90" 
              onClick={onStartWorkout}
            >
              Start Workout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WorkoutDetail; 