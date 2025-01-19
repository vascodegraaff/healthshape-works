import { Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { WorkoutTemplate } from "@/types/workout";
import { getExerciseImageUrl } from "@/lib/utils";
import AiNegotiation from "./AiNegotiation";
import { useContext, useEffect, useMemo, useState } from "react";
import { WorkoutContext } from "@/pages/Index";

interface AiWorkoutSectionProps {
  onWorkoutClick: (workout: WorkoutTemplate) => void;
}

const AiWorkoutSection = ({ onWorkoutClick }: AiWorkoutSectionProps) => {
  const { workoutRecommendation, setWorkoutRecommendation } = useContext(WorkoutContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (workoutRecommendation)
      setIsLoading(false);
  }, [workoutRecommendation]);
  // This would eventually come from an AI recommendation system
  const aiWorkout: WorkoutTemplate = useMemo(() => (
    !workoutRecommendation ? null :
      {
        id: "ai-1",
        user_id: "user_1",
        title: workoutRecommendation.title,
        description: workoutRecommendation.description,
        created_at: new Date(),
        updated_at: new Date(),
        duration: 45, // TODO let AI also estimate duration
        tags: ["AI Generated"], // TODO let AI also suggest tags
        intensity: "personalized", // TODO let AI also suggest intensity
        thumbnails: workoutRecommendation.exercises.map((exercise) => getExerciseImageUrl(exercise.name)),
        exercises: workoutRecommendation.exercises.map((exercise, index) => ({
          id: exercise.name.replace(' ', '_'),
          name: exercise.name,
          target_muscle: exercise.target_muscle,
          sets: exercise.sets.map((set) => ({
            weight: set.weight,
            reps: set.reps,
          })),
          order: index,
          image_url: getExerciseImageUrl(exercise.name)
        })),
      }), [workoutRecommendation]);


  if (isLoading && !workoutRecommendation) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          <h2 className="text-lg font-semibold">Loading AI Workout...</h2>
        </div>
        <Card className="p-4 space-y-4 bg-card animate-pulse">
          <div className="h-20 bg-accent/10 rounded-lg"></div>
        </Card>
      </div>
    );
  }
  if (!workoutRecommendation)
    return null;

  return (
    <div className="mb-8">
      {/* <AiNegotiation className="bg-red-500" /> */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold">AI Curated Workout</h2>
      </div>

      <Card
        className="p-4 space-y-4 bg-card hover:bg-card/80 transition-colors cursor-pointer"
        onClick={() => onWorkoutClick(aiWorkout)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex gap-2 mb-2">
              {aiWorkout.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-accent/10 text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-semibold">{aiWorkout.duration} min</h3>
            <p className="text-muted-foreground">{aiWorkout.title}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-accent"
            onClick={() => onWorkoutClick(aiWorkout)}
          >
            Try Now
          </Button>
        </div>

        <div className="flex gap-2">
          {aiWorkout.thumbnails.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail}
              alt={`Exercise ${index + 1}`}
              className="w-20 h-20 rounded-lg object-cover grayscale brightness-75"
            />
          ))}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Based on your recent workouts and progress</p>
        </div>
      </Card>
    </div>
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