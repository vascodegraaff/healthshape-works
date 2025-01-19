import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const getExerciseImageUrl = (exerciseId: string, imageIndex: number = 0) => 
  `/exercises/${exerciseId.replace(/ /g, '_')}/${imageIndex}.jpg`;
