export interface User {
  id: string;
  username: string;
  created_at: Date;
  settings: {
    units: 'kg' | 'lbs';
  };
}

// Base exercise definition from JSON files
export interface ExerciseDefinition {
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

// Exercise in a workout template (for planning)
export interface TemplateExercise {
  id: string;
  name: string;
  target_muscle: string;
  order: number;
  image_url?: string;
  sets?: number;
  reps?: number;
  weight?: number;
}

// Exercise in an active workout (during execution)
export interface ActiveExercise extends ExerciseDefinition {
  sets: Array<{
    weight: number;
    reps: number;
    completed: boolean;
  }>;
}

// Exercise set in history (after completion)
export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  weight: number;
  reps: number;
  completed_at: string | null;
  is_personal_record: boolean;
  notes: string | null;
}

// Workout template
export interface WorkoutTemplate {
  // id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  duration: number;
  tags: string[];
  intensity?: string;
  thumbnails: string[];
  exercises: TemplateExercise[];
}

// Active workout session
export interface WorkoutSession {
  user_id: string;
  template_id: string | null;
  title: string;
  started_at: Date;
  completed_at: Date | null;
  exercises: ActiveExercise[];
}

// Completed workout in history
export interface WorkoutHistory extends Omit<WorkoutSession, 'exercises'> {
  sets: WorkoutSet[];
}

// User types
export interface CurrentUser {
  id: string;
  username: string;
  settings: {
    units: 'kg' | 'lbs';
  };
} 