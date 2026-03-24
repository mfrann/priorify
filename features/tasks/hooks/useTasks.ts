import { useTaskStore } from '@/features/tasks/store/taskStore';
import type { Task } from '@/features/tasks/types/task';
import { useEffect, useMemo } from 'react';

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  isInitialized: boolean;
  activeTasks: Task[];
  completedTasks: Task[];
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}

export function useTasks(): UseTasksReturn {
  const store = useTaskStore();

  // Lazy initialization on first mount
  useEffect(() => {
    store.initialize();
  }, []);

  const activeTasks = useMemo(
    () => store.tasks.filter((t) => !t.completed),
    [store.tasks],
  );

  const completedTasks = useMemo(
    () => store.tasks.filter((t) => t.completed),
    [store.tasks],
  );

  return {
    //State
    isInitialized: store.isInitialized,
    tasks: store.tasks,
    isLoading: store.isLoading,

    //Computed helpers
    activeTasks,
    completedTasks,

    //Actions (rename for convenience)
    addTask: store.addTask,
    updateTask: store.updateTask,
    removeTask: store.removeTask,
    toggleComplete: store.toggleComplete,
    getTaskById: store.getTaskById,
  };
}
