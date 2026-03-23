import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Task } from "@/features/tasks/types/task";

const TASKS_PREFIX = "task:";

export const StorageService = {
  async getTask(id: string): Promise<Task | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(`${TASKS_PREFIX}${id}`);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("StorageService.getTask error:", error);
      return null;
    }
  },

  async saveTask(task: Task): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(task);
      await AsyncStorage.setItem(`${TASKS_PREFIX}${task.id}`, jsonValue);
      return true;
    } catch (error) {
      console.error("StorageService.saveTask error:", error);
      return false;
    }
  },

  async removeTask(id: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(`${TASKS_PREFIX}${id}`);
      return true;
    } catch (error) {
      console.error("StorageService.removeTask error:", error);
      return false;
    }
  },

  async getAllTasks(): Promise<Task[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const taskKeys = keys.filter((key) => key.startsWith(TASKS_PREFIX));
      if (taskKeys.length === 0) return [];
      
      const pairs = await AsyncStorage.multiGet(taskKeys);
      const tasks: Task[] = [];
      
      for (const [, value] of pairs) {
        if (value != null) {
          tasks.push(JSON.parse(value));
        }
      }
      
      return tasks;
    } catch (error) {
      console.error("StorageService.getAllTasks error:", error);
      return [];
    }
  },

  async taskExists(id: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(`${TASKS_PREFIX}${id}`);
      return value !== null;
    } catch (error) {
      console.error("StorageService.taskExists error:", error);
      return false;
    }
  },

  async clearAllTasks(): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const taskKeys = keys.filter((key) => key.startsWith(TASKS_PREFIX));
      if (taskKeys.length > 0) {
        await AsyncStorage.multiRemove(taskKeys);
      }
      return true;
    } catch (error) {
      console.error("StorageService.clearAllTasks error:", error);
      return false;
    }
  },
};
