import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WorkoutCardProps {
  title: string;
  duration: number;
  tags: string[];
  thumbnails: string[];
  onClick: () => void;
}

const WorkoutCard = ({ title, duration, tags, thumbnails, onClick }: WorkoutCardProps) => {
  return (
    <Card className="p-4 space-y-4 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex gap-2 mb-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
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