export interface Set {
    weight: number;
    reps: number;
}

export interface Exercise {
    name: string;
    target_muscle: string;
    sets: Set[];
}

export interface WorkoutResponse {
    title: string;
    exercises: Exercise[];
    description: string;
}

export const fetchAiWorkout = async (difficulty: number, explanation: string, muscles: string[]): Promise<WorkoutResponse> => {
    // TODO check also history and user data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                title: `Lvl${difficulty} workout for ${muscles.join(', ')}`,
                description: `This is a personalized workout for ${muscles.join("+")} on level ${difficulty} based on your recent activity and preferences`,
                exercises: [
                    {
                        name: 'Dumbbell Bench Press',
                        target_muscle: 'chest',
                        sets: [
                            { weight: 20, reps: 8 },
                            { weight: 20, reps: 8 },
                            { weight: 20, reps: 8 },
                        ],
                    },
                    {
                        name: 'Dumbbell Bicep Curl',
                        target_muscle: 'biceps',
                        sets: [
                            { weight: 10, reps: 12 },
                            { weight: 10, reps: 12 },
                            { weight: 10, reps: 12 },
                        ],
                    },
                    {
                        name: 'Zercher Squats',
                        target_muscle: 'quadriceps',
                        sets: [
                            { weight: 25, reps: 10 },
                            { weight: 25, reps: 10 },
                            { weight: 25, reps: 10 },
                        ],
                    },
                ],
            });
        }, 1000);
    });
};
