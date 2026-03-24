import { create } from 'zustand';
import type { Task } from '@/features/tasks/types/task';
import { StorageService } from '@/features/tasks/services/storage';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  isInitialized: boolean;

  getTaskById: (id: string) => Task | undefined;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: true,
  isInitialized: false,

  getTaskById: (id: string) => {
    return get().tasks.find((task) => task.id === id);
  },

  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      const tasks = await StorageService.getAllTasks();
      set({ tasks, isLoading: false, isInitialized: true });
    } catch (error) {
      console.error('TaskStore.loadTasks error:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  addTask: async (task: Task) => {
    const currentTasks = get().tasks;
    set({ tasks: [...currentTasks, task] });
    const success = await StorageService.saveTask(task);
    if (!success) {
      set({ tasks: currentTasks });
      console.error('Failed to persist task');
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    const currentTasks = get().tasks;
    const taskIndex = currentTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) return;

    const updatedTask = { ...currentTasks[taskIndex], ...updates };
    const newTasks = [...currentTasks];
    newTasks[taskIndex] = updatedTask;
    set({ tasks: newTasks });

    const success = await StorageService.saveTask(updatedTask);
    if (!success) {
      set({ tasks: currentTasks });
      console.error('Failed to persist task update');
    }
  },

  removeTask: async (id: string) => {
    const currentTasks = get().tasks;
    const newTasks = currentTasks.filter((t) => t.id !== id);
    set({ tasks: newTasks });

    const success = await StorageService.removeTask(id);
    if (!success) {
      set({ tasks: currentTasks });
      console.error('Failed to remove task from storage');
    }
  },

  toggleComplete: async (id: string) => {
    const currentTasks = get().tasks;
    const task = currentTasks.find((t) => t.id === id);
    if (!task) return;

    // Optimistic update
    const newCompleted = !task.completed;
    const newTasks = currentTasks.map((t) =>
      t.id === id ? { ...t, completed: newCompleted } : t
    );
    set({ tasks: newTasks });

    // Persist and rollback on failure
    const success = await StorageService.saveTask({ ...task, completed: newCompleted });
    if (!success) {
      set({ tasks: currentTasks });
      console.error('Failed to persist toggleComplete');
    }
  },
}));
