import { supabase } from '@/lib/supabase';
import { WorkoutSession, Exercise, Set } from '@/types/workout';

export const workoutService = {
  async saveWorkout(workout: WorkoutSession) {
    // First save the workout session
    const { data: workoutData, error: workoutError } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: workout.user_id,
        title: workout.title,
        started_at: workout.started_at,
        completed_at: workout.completed_at,
        // description: workout.description,
      })
      .select()
      .single();

    if (workoutError) throw workoutError;

    // // Then save each exercise and its sets
    // for (const exercise of workout.exercises) {
    //   const { data: exerciseData, error: exerciseError } = await supabase
    //     .from('exercises_in_workout')
    //     .insert({
    //       workout_session_id: workoutData.id,
    //       exercise_name: exercise.name,
    //     })
    //     .select()
    //     .single();

    //   if (exerciseError) throw exerciseError;

    //   // Save sets for this exercise
    //   const setsToInsert = exercise.sets.map(set => ({
    //     exercise_id: exerciseData.id,
    //     weight: set.weight,
    //     reps: set.reps,
    //     completed: set.completed,
    //   }));

    //   const { error: setsError } = await supabase
    //     .from('exercise_sets')
    //     .insert(setsToInsert);

    //   if (setsError) throw setsError;
    // }

    return workoutData;
  },

  async getAllHistory() {
    const { data: workouts, error: workoutsError } = await supabase
      .from('workout_sessions')
      .select('*, workout_sets(*)');

    if (workoutsError) throw workoutsError;

    console.log(workouts);
    return workouts;
  },

  async getWorkouts() {
    const { data: workouts, error: workoutsError } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        exercises:exercises_in_workout (
          *,
          sets:exercise_sets (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (workoutsError) throw workoutsError;

    return workouts.map(workout => ({
      ...workout,
      exercises: workout.exercises.map((exercise: any) => ({
        name: exercise.exercise_name,
        sets: exercise.sets,
      })),
    }));
  },

  async getWorkout(id: string) {
    const { data: workout, error: workoutError } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        exercises:exercises_in_workout (
          *,
          sets:exercise_sets (*)
        )
      `)
      .eq('id', id)
      .single();

    if (workoutError) throw workoutError;

    return {
      ...workout,
      exercises: workout.exercises.map((exercise: any) => ({
        name: exercise.exercise_name,
        sets: exercise.sets,
      })),
    };
  },
}; 