import { WorkoutTemplate } from "@/types/workout";
import { generateId, getExerciseImageUrl } from "@/lib/utils";

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: generateId(),
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
      {
        id: "Alternate_Incline_Dumbbell_Curl",
        name: "Alternate Incline Dumbbell Curl",
        target_muscle: "biceps",
        sets: 3,
        order: 0,
        image_url: getExerciseImageUrl("Alternate_Incline_Dumbbell_Curl"),
      },
      {
        id: "Alternating_Cable_Shoulder_Press",
        name: "Alternating Cable Shoulder Press",
        target_muscle: "shoulders",
        sets: 4,
        order: 1,
        image_url: getExerciseImageUrl("Alternating_Cable_Shoulder_Press"),
      },
      {
        id: "Alternating_Floor_Press",
        name: "Alternating Floor Press",
        target_muscle: "chest",
        sets: 3,
        order: 2,
        image_url: getExerciseImageUrl("Alternating_Floor_Press"),
      },
    ],
  },
  {
    id: generateId(),
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
      {
        id: "Ab_Roller",
        name: "Ab Roller",
        target_muscle: "abdominals",
        sets: 3,
        order: 0,
        image_url: getExerciseImageUrl("Ab_Roller"),
      },
      {
        id: "Air_Bike",
        name: "Air Bike",
        target_muscle: "abdominals",
        sets: 3,
        order: 1,
        image_url: getExerciseImageUrl("Air_Bike"),
      },
      {
        id: "Alternate_Heel_Touchers",
        name: "Alternate Heel Touchers",
        target_muscle: "abdominals",
        sets: 3,
        order: 2,
        image_url: getExerciseImageUrl("Alternate_Heel_Touchers"),
      },
    ],
  },
]; 