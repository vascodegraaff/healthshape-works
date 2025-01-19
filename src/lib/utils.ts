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

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
