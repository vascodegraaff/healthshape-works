import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";
import { Exercise } from "@/types/workout";

interface WorkoutDetailProps {
  title: string;
  exercises: Exercise[];
  onClose: () => void;
  onStartWorkout: () => void;
  lastPerformed?: string;
}

const WorkoutDetail = ({ title, exercises, onClose, onStartWorkout, lastPerformed }: WorkoutDetailProps) => {
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] p-0" 
        hideCloseButton
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-border">
            <div className="w-10" />
            <h1 className="text-xl font-semibold">{title}</h1>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {lastPerformed && (
              <div className="text-muted-foreground mb-4">
                Last Performed: {lastPerformed}
              </div>
            )}
            
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-card">
                  <img 
                    src={exercise.image_url} 
                    alt={exercise.name}
                    className="w-16 h-16 rounded-lg object-cover grayscale brightness-75"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{exercise.name}</h3>
                      <button className="ml-auto p-1 rounded-full bg-accent/10 text-accent">
                        ?
                      </button>
                    </div>
                    <p className="text-muted-foreground">{exercise.target_muscle}</p>
                    <p>{exercise.sets.length}×</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
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