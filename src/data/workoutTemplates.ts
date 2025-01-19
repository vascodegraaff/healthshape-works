import { WorkoutTemplate, TemplateExercise } from "@/types/workout";
import { generateId, getExerciseImageUrl } from "@/lib/utils";

// Helper function to create template exercise
const createTemplateExercise = (
  id: string,
  name: string,
  targetMuscle: string,
  order: number,
  sets: number = 3
): TemplateExercise => ({
  id,
  name,
  target_muscle: targetMuscle,
  order,
  image_url: getExerciseImageUrl(id),
  sets
});

export const workoutTemplates: WorkoutTemplate[] = [
  {
    user_id: "user_1",
    title: "Upper Body Strength",
    description: "Focus on building upper body strength",
    created_at: new Date(),
    updated_at: new Date(),
    duration: 45,
    tags: ["Strength", "Upper Body"],
    intensity: "hard",
    thumbnails: [
      getExerciseImageUrl("Alternate_Incline_Dumbbell_Curl"),
      getExerciseImageUrl("Alternating_Cable_Shoulder_Press"),
      getExerciseImageUrl("Alternating_Floor_Press"),
    ],
    exercises: [
      createTemplateExercise("Alternate_Incline_Dumbbell_Curl", "Alternate Incline Dumbbell Curl", "biceps", 0),
      createTemplateExercise("Alternating_Cable_Shoulder_Press", "Alternating Cable Shoulder Press", "shoulders", 1),
      createTemplateExercise("Alternating_Floor_Press", "Alternating Floor Press", "chest", 2),
    ],
  },
  {
    user_id: "user_1",
    title: "Core Strength",
    description: "Build a strong core foundation",
    created_at: new Date(),
    updated_at: new Date(),
    duration: 30,
    tags: ["Core", "Strength"],
    intensity: "average",
    thumbnails: [
      getExerciseImageUrl("Ab_Roller"),
      getExerciseImageUrl("Air_Bike"),
      getExerciseImageUrl("Alternate_Heel_Touchers"),
    ],
    exercises: [
      createTemplateExercise("Ab_Roller", "Ab Roller", "abdominals", 0),
      createTemplateExercise("Air_Bike", "Air Bike", "abdominals", 1),
      createTemplateExercise("Alternate_Heel_Touchers", "Alternate Heel Touchers", "abdominals", 2),
    ],
  },
]; 