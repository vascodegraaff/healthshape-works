export interface User {
  id: string;
  username: string;
  created_at: Date;
  settings: {
    units: 'kg' | 'lbs';
  };
}

export interface WorkoutTemplate {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  duration: number;
  exercises: WorkoutExercise[];
  tags: string[];
  intensity: 'recovery' | 'average' | 'hard';
  thumbnails: string[];
}

export interface WorkoutExercise {
  id: string;
  name: string;
  target_muscle: string;
  sets: number;
  order: number;
  image_url?: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  template_id?: string;
  title: string;
  started_at: Date;
  completed_at?: Date;
  exercises: CompletedExercise[];
}

export interface CompletedExercise {
  id: string;
  workout_session_id: string;
  exercise_name: string;
  target_muscle: string;
  order: number;
  sets: CompletedSet[];
}

export interface CompletedSet {
  id: string;
  exercise_id: string;
  weight: number;
  reps: number;
  completed_at?: Date;
} 