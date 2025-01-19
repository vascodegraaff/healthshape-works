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

export interface WorkoutForm {
    user_id: string;
    age: number;
    weight: number;
    difficulty: string;
    muscle_groups: string[];
    length: number;
    comment: string;
}

export const fetchAiWorkout = async (
    // age: number,
    // weight: number,
    difficulty_number: number,
    comment: string,
    muscle_groups: string[],
    // length: number,
): Promise<WorkoutResponse> => {
    console.log("fetching a workout")
    // const url = import.meta.env.BACKEND_URL;
    const full_url = "http://localhost:8000/make-workout";
    console.log(full_url);
    let difficulty = "medium";
    if (difficulty_number == 1) {
        difficulty = "easy";
    } else if (difficulty_number == 3) {
        difficulty = "hard";
    }
    const form: WorkoutForm = {
        user_id: "a879f12d-8834-4987-859a-0d53e72d76a3",
        age: 30,
        weight: 70,
        difficulty,
        muscle_groups,
        length: 30,
        comment
    };

    try {
        const response = await fetch(full_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as WorkoutResponse;
    } catch (error) {
        console.error('Error fetching workout:', error);
        throw error;
    }
};
