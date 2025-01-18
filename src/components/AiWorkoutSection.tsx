import { Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { WorkoutTemplate } from "@/types/workout";

interface AiWorkoutSectionProps {
  onWorkoutClick: (workout: WorkoutTemplate) => void;
}

const AiWorkoutSection = ({ onWorkoutClick }: AiWorkoutSectionProps) => {
  // This would eventually come from an AI recommendation system
  const aiWorkout: WorkoutTemplate = {
    id: "ai-1",
    user_id: "user_1",
    title: "AI Recommended: Upper Body Focus",
    description: "Personalized upper body workout based on your recent activity",
    created_at: new Date(),
    updated_at: new Date(),
    duration: 45,
    tags: ["AI Generated", "Upper Body"],
    intensity: "hard",
    thumbnails: [
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=160&h=160&fit=crop",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=160&h=160&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=160&h=160&fit=crop",
    ],
    exercises: [
      {
        id: "ai-ex-1",
        name: "Bench Press",
        target_muscle: "Chest",
        sets: 4,
        order: 0,
        image_url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=160&h=160&fit=crop",
      },
      {
        id: "ai-ex-2",
        name: "Pull-ups",
        target_muscle: "Back",
        sets: 3,
        order: 1,
        image_url: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=160&h=160&fit=crop",
      },
      // Add more exercises as needed
    ],
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold">AI Curated Workout</h2>
      </div>
      
      <Card className="p-4 space-y-4 bg-card hover:bg-card/80 transition-colors cursor-pointer">
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
              className="w-20 h-20 rounded-lg object-cover"
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