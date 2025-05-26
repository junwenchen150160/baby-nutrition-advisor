"use client";

import { useState, useEffect } from "react";

type BabyData = {
  age: number;
  gender: string;
  healthConditions: string[];
  specialNotes: string;
};

export function useBabyStorage() {
  const getBabyData = (): BabyData | null => {
    if (typeof window === "undefined") return null;
    
    const storedData = localStorage.getItem("babyData");
    if (!storedData) return null;
    
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Error parsing baby data from localStorage:", error);
      return null;
    }
  };
  
  const saveBabyData = (data: BabyData) => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem("babyData", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving baby data to localStorage:", error);
    }
  };
  
  return {
    getBabyData,
    saveBabyData,
  };
}