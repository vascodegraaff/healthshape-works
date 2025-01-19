import { WorkoutResponse } from './aiRequest';

export const dummyWorkoutResponse: WorkoutResponse = {
    title: "Full Body Strength Training",
    description: "This workout is designed to target major muscle groups with compound movements, perfect for building overall strength and muscle endurance. The workout includes a mix of push and pull exercises with progressive overload.",
    exercises: [
        {
            name: "Bench Press",
            target_muscle: "chest",
            sets: [
                { weight: 60, reps: 12 },
                { weight: 65, reps: 10 },
                { weight: 70, reps: 8 }
            ]
        },
        {
            name: "Squats",
            target_muscle: "quadriceps",
            sets: [
                { weight: 80, reps: 12 },
                { weight: 85, reps: 10 },
                { weight: 90, reps: 8 }
            ]
        },
        {
            name: "Bent Over Rows",
            target_muscle: "back",
            sets: [
                { weight: 50, reps: 12 },
                { weight: 55, reps: 10 },
                { weight: 60, reps: 8 }
            ]
        },
        {
            name: "Shoulder Press",
            target_muscle: "shoulders",
            sets: [
                { weight: 40, reps: 12 },
                { weight: 45, reps: 10 },
                { weight: 50, reps: 8 }
            ]
        }
    ]
};
