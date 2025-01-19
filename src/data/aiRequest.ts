import { exercises } from './exercises';

export interface Set {
    weight: number;
    reps: number;
}

export interface Exercise {
    id?: string;
    name: string;
    target_muscle: string;
    sets: number;
    reps: number;
    weight?: number;
}

export interface WorkoutResponse {
    title: string;
    exercises: Exercise[];
    description: string;
}

// Helper to filter exercises by muscle group
const getExercisesForMuscle = (muscle: string) => {
  return exercises.filter(ex => 
    ex.primaryMuscles.includes(muscle) || 
    ex.secondaryMuscles.includes(muscle)
  );
};

// Helper to get random items from array
const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const fetchAiWorkout = async (
  difficulty: number, 
  explanation: string, 
  muscles: string[]
): Promise<WorkoutResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Get exercises for each muscle group
  const availableExercises = muscles.flatMap(muscle => getExercisesForMuscle(muscle));
  
  // Select 3-5 random exercises based on difficulty
  const exerciseCount = Math.min(difficulty + 2, 5);
  const selectedExercises = getRandomItems(availableExercises, exerciseCount);

  // Convert exercises to workout format
  const workoutExercises: Exercise[] = selectedExercises.map(exercise => {
    // Scale sets and reps based on difficulty
    const baseSets = Math.min(difficulty, 5);
    const baseReps = difficulty <= 3 ? 12 : 8;
    
    return {
      id: exercise.id,
      name: exercise.name,
      target_muscle: exercise.primaryMuscles[0],
      sets: baseSets,
      reps: baseReps,
      // Only add weight for strength exercises
      weight: exercise.category === 'strength' ? difficulty * 5 : 0,
    };
  });

  // Generate descriptive title based on muscles and difficulty
  const difficultyLabels = ['Beginner', 'Light', 'Moderate', 'Challenging', 'Intense'];
  const muscleDescription = muscles.join(' & ');
  const title = `${difficultyLabels[difficulty-1]} ${muscleDescription} Workout`;

  // Generate workout description
  const description = explanation || 
    `A ${difficultyLabels[difficulty-1].toLowerCase()} workout focusing on ${muscleDescription}. ` +
    `${exerciseCount} exercises designed to target these muscle groups effectively.`;

  return {
    title,
    description,
    exercises: workoutExercises,
  };
};
