import { useState, useEffect } from "react";
import { MoreHorizontal, RotateCcw, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";
import Timer from "./Timer";
import { storage } from "@/lib/storage";
import AddExerciseSheet from "./AddExerciseSheet";
import { ActiveExercise, WorkoutSession } from "@/types/workout";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Set {
  weight: number;
  reps: number;
  completed?: boolean;
}

interface Exercise {
  name: string;
  sets: Set[];
  previousSets?: string[];
}

interface ActiveWorkoutProps {
  title: string;
  exercises: ActiveExercise[];
  startTime: Date;
  onFinish: () => void;
  onClose: () => void;
  onMinimize?: () => void;
}

const ActiveWorkout = ({ 
  title, 
  exercises: initialExercises = [],
  startTime,
  onFinish, 
  onClose,
  onMinimize 
}: ActiveWorkoutProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [exercises, setExercises] = useState<ActiveExercise[]>(initialExercises);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);

  // Load saved exercise state
  useEffect(() => {
    const savedWorkout = storage.getActiveWorkout();
    if (savedWorkout) {
      setExercises(savedWorkout.exercises);
    }
  }, []);

  const toggleSetCompletion = (exerciseIndex: number, setIndex: number) => {
    setExercises(currentExercises => {
      const newExercises = [...currentExercises];
      const exercise = { ...newExercises[exerciseIndex] };
      const set = { ...exercise.sets[setIndex] };
      set.completed = !set.completed;
      exercise.sets = [...exercise.sets];
      exercise.sets[setIndex] = set;
      newExercises[exerciseIndex] = exercise;

      // Save updated exercises state
      const savedWorkout = storage.getActiveWorkout();
      if (savedWorkout) {
        storage.saveActiveWorkout({
          ...savedWorkout,
          exercises: newExercises,
        });
      }

      return newExercises;
    });
  };

  const handleWeightChange = (exerciseIndex: number, setIndex: number, weight: number) => {
    setExercises(currentExercises => {
      const newExercises = [...currentExercises];
      const exercise = { ...newExercises[exerciseIndex] };
      const set = { ...exercise.sets[setIndex], weight };
      exercise.sets = [...exercise.sets];
      exercise.sets[setIndex] = set;
      newExercises[exerciseIndex] = exercise;

      // Save updated exercises state
      const savedWorkout = storage.getActiveWorkout();
      if (savedWorkout) {
        storage.saveActiveWorkout({
          ...savedWorkout,
          exercises: newExercises,
        });
      }

      return newExercises;
    });
  };

  const handleRepsChange = (exerciseIndex: number, setIndex: number, reps: number) => {
    setExercises(currentExercises => {
      const newExercises = [...currentExercises];
      const exercise = { ...newExercises[exerciseIndex] };
      const set = { ...exercise.sets[setIndex], reps };
      exercise.sets = [...exercise.sets];
      exercise.sets[setIndex] = set;
      newExercises[exerciseIndex] = exercise;

      // Save updated exercises state
      const savedWorkout = storage.getActiveWorkout();
      if (savedWorkout) {
        storage.saveActiveWorkout({
          ...savedWorkout,
          exercises: newExercises,
        });
      }

      return newExercises;
    });
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onMinimize) {
      onMinimize();
    }
  };

  const handleAddSet = (exerciseIndex: number) => {
    setExercises(currentExercises => {
      const newExercises = [...currentExercises];
      const exercise = { ...newExercises[exerciseIndex] };
      
      // Initialize sets array if it doesn't exist
      if (!exercise.sets) {
        exercise.sets = [];
      }
      
      // Add new empty set
      const newSet = {
        weight: 0,
        reps: 0,
        completed: false
      };
      
      exercise.sets = [...exercise.sets, newSet];
      newExercises[exerciseIndex] = exercise;

      // Update the active workout in storage with new set
      const savedWorkout = storage.getActiveWorkout();
      if (savedWorkout) {
        savedWorkout.exercises = newExercises; // Update exercises array
        storage.saveActiveWorkout(savedWorkout);
      }

      return newExercises;
    });
  };

  const handleAddExercise = (exerciseId: string) => {
    // Create new active exercise with initial set
    const newExercise: ActiveExercise = {
      id: exerciseId,
      name: exerciseId.replace(/_/g, ' '),
      force: "push",
      level: "beginner",
      mechanic: null,
      equipment: null,
      primaryMuscles: [],
      secondaryMuscles: [],
      instructions: [],
      category: "strength",
      images: [`${exerciseId}/0.jpg`, `${exerciseId}/1.jpg`],
      sets: [{
        weight: 0,
        reps: 0,
        completed: false
      }]
    };

    setExercises(current => {
      const newExercises = [...current, newExercise];
      
      // Update the active workout in storage with new exercise
      const savedWorkout = storage.getActiveWorkout();
      if (savedWorkout) {
        savedWorkout.exercises = newExercises; // Update exercises array
        storage.saveActiveWorkout(savedWorkout);
      }

      return newExercises;
    });

    setIsAddExerciseOpen(false);
  };

  const handleRemoveExercise = (exerciseIndex: number) => {
    setExercises(prev => {
      const updatedExercises = prev.filter((_, index) => index !== exerciseIndex);
      
      // Save updated exercises state
      const savedWorkout = storage.getActiveWorkout();
      if (savedWorkout) {
        storage.saveActiveWorkout({
          ...savedWorkout,
          exercises: updatedExercises,
        });
      }

      return updatedExercises;
    });
  };

  const handleFinishWorkout = () => {
    // Implement the logic to finish the workout
    console.log("Finishing workout");
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent 
          side="bottom" 
          className="h-[90vh] p-0"
          hideCloseButton
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="w-20" /> {/* Spacer for alignment */}
              <div className="flex flex-col items-center">
                <h1 className="text-xl font-semibold">{title}</h1>
                <Timer startTime={startTime} />
              </div>
              <Button 
                variant="ghost" 
                className="text-accent w-20 justify-end" 
                onClick={onFinish}
              >
                Finish
              </Button>
            </div>

            {/* Exercises */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 p-4">
                {exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{exercise.name}</h3>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleRemoveExercise(exerciseIndex)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Exercise
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-5 gap-4 text-sm mb-2">
                        <div>Set</div>
                        <div>Previous</div>
                        <div>kg</div>
                        <div>Reps</div>
                        <div></div>
                      </div>
                      
                      {exercise.sets.map((set, setIndex) => (
                        <div 
                          key={setIndex} 
                          className={`relative grid grid-cols-5 gap-4 items-center mb-2 ${
                            set.completed ? "opacity-80" : ""
                          }`}
                        >
                          {set.completed && (
                            <div className="absolute inset-0 bg-accent/20 rounded pointer-events-none" />
                          )}
                          <div>{setIndex + 1}</div>
                          <div className="text-muted-foreground">
                          </div>
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => handleWeightChange(exerciseIndex, setIndex, Number(e.target.value))}
                            className="w-full bg-card rounded p-2 text-center"
                          />
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => handleRepsChange(exerciseIndex, setIndex, Number(e.target.value))}
                            className="w-full bg-card rounded p-2 text-center"
                          />
                          <button 
                            onClick={() => toggleSetCompletion(exerciseIndex, setIndex)}
                            className={`p-2 rounded transition-colors ${
                              set.completed ? "bg-accent text-accent-foreground" : "bg-card hover:bg-card/80"
                            }`}
                          >
                            ✓
                          </button>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => handleAddSet(exerciseIndex)}
                      >
                        + Add Set
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Exercise Button */}
                <div className="p-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsAddExerciseOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
              </div>
            </div>
          </div> 
        </SheetContent>
      </Sheet>

      <AddExerciseSheet
        open={isAddExerciseOpen}
        onClose={() => setIsAddExerciseOpen(false)}
        onAddExercise={handleAddExercise}
      />
    </>
  );
};

export default ActiveWorkout; 