import { useState, useEffect } from 'react';
import { workoutService } from '@/services/workoutService';
import { WorkoutSession } from '@/types/workout';
import { format } from 'date-fns';
import BottomNav from "@/components/BottomNav";
import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const History = () => {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await workoutService.getAllHistory();
        setWorkouts(data);
      } catch (error) {
        console.error('Failed to load workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const getBestSet = (sets: Array<{ weight: number; reps: number }>) => {
    if (!sets.length) return null;
    return sets.reduce((best, current) => {
      return (current.weight * current.reps) > (best.weight * best.reps) ? current : best;
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container px-4 py-4">
        <h1 className="text-2xl font-bold mb-6">Workout History</h1>
        
        <div className="space-y-4">
          {workouts.map((workout) => (
            <Card key={workout.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{workout.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(workout.started_at), 'PP')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {workout.duration} min
                    </div>
                  </div>
                </div>
                {/* <div className="flex gap-2">
                  {workout.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 rounded-full text-sm bg-accent/10 text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div> */}
              </div>

              <div className="space-y-2 text-sm">
                {/* {workout.sets.map((exercise, index) => {
                  const bestSet = getBestSet(exercise.sets);
                  return (
                    <div key={index} className="flex items-center justify-between py-1 border-b border-border last:border-0">
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
                })} */}
                
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default History;
