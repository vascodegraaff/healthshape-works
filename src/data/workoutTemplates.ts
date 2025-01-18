import { WorkoutTemplate } from "@/types/workout";
import { generateId } from "@/lib/utils";

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: generateId(),
    user_id: "user_1",
    title: "Full Body HIIT",
    description: "High intensity full body workout",
    created_at: new Date(),
    updated_at: new Date(),
    duration: 45,
    tags: ["HIIT", "Strength"],
    intensity: "hard",
    thumbnails: [
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=160&h=160&fit=crop",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=160&h=160&fit=crop",
      "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=160&h=160&fit=crop",
    ],
    exercises: [
      {
        id: generateId(),
        name: "Burpees",
        target_muscle: "Full Body",
        sets: 3,
        order: 0,
        image_url: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=160&h=160&fit=crop",
      },
      // Add more exercises...
    ],
  },
  {
    id: generateId(),
    user_id: "user_1",
    title: "Core Crusher",
    description: "Intense core workout",
    created_at: new Date(),
    updated_at: new Date(),
    duration: 30,
    tags: ["Abs", "Core"],
    intensity: "average",
    thumbnails: [
      "https://images.unsplash.com/photo-1544216717-3bbf52512659?w=160&h=160&fit=crop",
      "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=160&h=160&fit=crop",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=160&h=160&fit=crop",
    ],
    exercises: [
      {
        id: generateId(),
        name: "Plank",
        target_muscle: "Core",
        sets: 3,
        order: 0,
        image_url: "https://images.unsplash.com/photo-1544216717-3bbf52512659?w=160&h=160&fit=crop",
      },
      // Add more exercises...
    ],
  },
  // ... add the other templates
]; 