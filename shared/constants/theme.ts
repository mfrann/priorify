import type { Priority } from "@/features/tasks/types/task";

export const PRIORITY_COLORS: Record<Priority, string> = {
  1: "#B5D8EB",
  2: "#D4C4E8",
  3: "#F0C4B8",
};

export const BUBBLE_SIZE: Record<Priority, number> = {
  1: 50,
  2: 90,
  3: 150,
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
};

export const CATEGORY_COLORS = {
  WORK: "#9dc0fb",
  PERSONAL: "#e4a4fd",
  STUDY: "#99fc8c",
  HEALTH: "#fe9393",
  FUN: "#fee176",
};

export const CATEGORY_LABELS = {
  WORK: "Work",
  PERSONAL: "Personal",
  STUDY: "Study",
  HEALTH: "Health",
  FUN: "Fun",
};

export const NO_CATEGORY_COLOR = "#CCCCCC";
