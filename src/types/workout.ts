export interface User {
  id: string;
  username: string;
  created_at: Date;
  settings: {
    units: 'kg' | 'lbs';
  };
}

export interface Set {
  weight: number;
  reps: number;
  completed?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  target_muscle: string;
  sets: Set[];
  order: number;
  image_url: string;
  previousSets?: string[];
}

export interface WorkoutTemplate {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  duration: number;
  tags: string[];
  intensity?: string;
  thumbnails: string[];
  exercises: Exercise[];
}

export interface WorkoutSession extends Omit<WorkoutTemplate, 'exercises'> {
  template_id: string;
  started_at: Date;
  completed_at?: Date;
  exercises: Exercise[];
} 