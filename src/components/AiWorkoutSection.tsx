import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import { WorkoutTemplate, WorkoutSession } from "@/types/workout";
import { fetchAiWorkout } from "@/data/aiRequest";
import AiNegotiation from "./AiNegotiation";

interface AiWorkoutSectionProps {
  onWorkoutClick: (workout: WorkoutSession) => void;
}

const AiWorkoutSection = ({ onWorkoutClick }: AiWorkoutSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [workout, setWorkout] = useState<WorkoutTemplate | null>(null);
  const [showNegotiation, setShowNegotiation] = useState(false);

  const handleGenerateWorkout = async () => {
    setShowNegotiation(true);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">AI Workout</h2>
        <Card className="p-4 border-2 border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors max-w-md mx-auto">
          <div className="flex flex-col gap-4">
            {workout ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{workout.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateWorkout}
                    disabled={isLoading}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
                {/* <p className="text-sm text-muted-foreground">
                  {workout.exercises.length} exercises • {workout.exercises.reduce((acc, ex) => acc + (ex.sets ?? 0), 0)} sets
                </p> */}
                <Button 
                  className="w-full"
                  onClick={() => onWorkoutClick(workout as WorkoutSession)}
                >
                  Start Workout
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">AI Workout Generation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get a personalized workout plan based on your goals
                  </p>
                  <Button
                    onClick={handleGenerateWorkout}
                    disabled={isLoading}
                    className="min-w-[200px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Workout
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Dialog open={showNegotiation} onOpenChange={setShowNegotiation}>
        <DialogContent className="max-w-3xl h-[90vh] p-0">
          <AiNegotiation 
            onWorkoutGenerated={(generatedWorkout) => {
              setWorkout(generatedWorkout as WorkoutTemplate);
            }}
            onStartWorkout={(workout) => {
              onWorkoutClick(workout);
              setShowNegotiation(false);
            }}
            onClose={() => setShowNegotiation(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiWorkoutSection;

/*
TODO
we need to query the ai to get the recommended workout (based on our history)
this preview will already be shown
on click, we will show difficulty, short explanation, the target muscles, and the exercises
if the user doesn't like it, he can select difficulty, rewrite the explanation and retoggle the target muscles
the target muscles will be using pretty component with front and back of the body and selected muscle groups
there should be a refresh button to get a new workout
*/