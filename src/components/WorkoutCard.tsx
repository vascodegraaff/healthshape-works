import { Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Exercise } from "@/types/workout";

interface WorkoutCardProps {
  title: string;
  exercises: Exercise[];
  duration?: number;
  onClick?: () => void;
}

const WorkoutCard = ({ title, exercises, duration = 45, onClick }: WorkoutCardProps) => {
  return (
    <Card 
      className="p-4 hover:bg-card/80 transition-colors border-border/5 shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-2">
        {/* Title */}
        <h3 className="text-lg font-bold tracking-tight">
          {title}
        </h3>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{duration} min</span>
        </div>

        {/* Labels */}
        <div className="flex flex-wrap gap-1.5">
          {exercises.slice(0, 3).map((exercise, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent"
            >
              {exercise.target_muscle}
            </span>
          ))}
          {exercises.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
              +{exercises.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WorkoutCard;