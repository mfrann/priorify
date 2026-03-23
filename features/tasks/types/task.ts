export type Priority = 1 | 2 | 3;

export type Category = "WORK" | "PERSONAL" | "STUDY" | "HEALTH" | "FUN";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category?: Category;
  completed: boolean;
  createdAt: string;
  deadline?: string;
}

export type TaskInput = Omit<Task, "id" | "createdAt">;
