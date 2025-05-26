export interface RecommendationType {
  food: string;
  activity: string;
  development: string;
  exercise: string;
}

export interface BabyData {
  age: number;
  gender: "male" | "female";
  weight?: number;
  height?: number;
  healthConditions?: string[];
  allergies?: string[];
  specialNotes?: string;
  feedingType?: "breastfeeding" | "formula" | "mixed";
  sleepHours?: number;
}