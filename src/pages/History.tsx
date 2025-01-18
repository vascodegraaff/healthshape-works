import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { Calendar, Clock } from "lucide-react";
import { WorkoutTemplate } from "@/types/workout";
import { workoutTemplates } from "@/data/workoutTemplates";

const History = () => {
  // This would eventually come from a real workout history
  const completedWorkouts = workoutTemplates.map(workout => ({
    ...workout,
    completed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const getBestSet = (sets: Array<{ weight: number; reps: number }>) => {
    if (!sets.length) return null;
    return sets.reduce((best, current) => {
      return (current.weight * current.reps) > (best.weight * best.reps) ? current : best;
    });
  };

  return (
    <div className="container pb-20">
      <h1 className="text-2xl font-bold my-6">Workout History</h1>

      <div className="space-y-4">
        {completedWorkouts.sort((a, b) => b.completed_at.getTime() - a.completed_at.getTime()).map((workout) => (
          <Card key={workout.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{workout.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {workout.completed_at.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {workout.duration} min
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {workout.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 rounded-full text-sm bg-accent/10 text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {workout.exercises.map((exercise) => {
                const bestSet = getBestSet(exercise.sets);
                return (
                  <div key={exercise.id} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                    <span className="text-foreground">
                      {exercise.sets.length}× {exercise.name}
                    </span>
                    {bestSet && (
                      <span className="text-muted-foreground">
                        Best: {bestSet.weight}kg × {bestSet.reps}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default History;
