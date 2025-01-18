export interface Exercise {
  id: string;
  name: string;
  force: string;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

// Use Vite's import.meta.glob to dynamically import all exercise JSON files
const exerciseModules = import.meta.glob<Exercise>('/exercises/*.json', { 
  import: 'default',
  eager: true 
});

// Convert the modules object to an array of exercises
export const exercises: Exercise[] = Object.values(exerciseModules);

// Get unique categories from all exercises
export const exerciseCategories = Array.from(new Set(
  exercises.flatMap(exercise => exercise.primaryMuscles)
)).sort();

// Get unique equipment types
export const equipmentTypes = Array.from(new Set(
  exercises.map(exercise => exercise.equipment).filter(Boolean)
)).sort();

// Get unique levels
export const levels = Array.from(new Set(
  exercises.map(exercise => exercise.level)
)).sort(); 