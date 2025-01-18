import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WorkoutTemplate } from "@/types/workout";

interface WorkoutCardProps extends WorkoutTemplate {
  onClick: () => void;
}

const WorkoutCard = ({ title, duration, tags, thumbnails, intensity, onClick }: WorkoutCardProps) => {
  const getIntensityColor = (intensity?: string) => {
    switch (intensity) {
      case 'recovery':
        return 'bg-emerald-950 text-emerald-400';
      case 'hard':
        return 'bg-rose-950 text-rose-400';
      case 'average':
        return 'bg-amber-950 text-amber-400';
      default:
        return 'bg-accent/10 text-accent';
    }
  };

  return (
    <Card 
      className="p-4 space-y-4 bg-card hover:bg-card/80 transition-colors cursor-pointer" 
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex gap-2 mb-2">
            {tags.map((tag) => (
              <span key={tag} className={`px-3 py-1 rounded-full text-sm ${getIntensityColor(intensity)}`}>
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-semibold">{duration} min</h3>
          <p className="text-muted-foreground">{title}</p>
        </div>
        <button className="p-2 rounded-lg bg-background shadow-sm">
          <ArrowRight className="w-5 h-5 text-accent" />
        </button>
      </div>
      <div className="flex gap-2">
        {thumbnails.map((thumbnail, index) => (
          <img
            key={index}
            src={thumbnail}
            alt={`Exercise ${index + 1}`}
            className="w-20 h-20 rounded-lg object-cover"
          />
        ))}
      </div>
    </Card>
  );
};

export default WorkoutCard;