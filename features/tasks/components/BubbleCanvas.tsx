import type { Task } from "@/features/tasks/types/task";
import {
  BUBBLE_SIZE,
  CATEGORY_COLORS,
  NO_CATEGORY_COLOR,
} from "@/shared/constants/theme";
import { useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BubbleItem } from "./BubbleItem";

type StatusFilter = "all" | "completed" | "active";

interface BubbleCanvasProps {
  tasks: Task[];
  statusFilter: StatusFilter;
  onBubblePress: (task: Task) => void;
  onToggleComplete: (taskId: string, willBeCompleted: boolean) => void;
}
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CANVAS_PADDING = 50;
const BASE_CANVAS_WIDTH = SCREEN_WIDTH;
const BASE_CANVAS_HEIGHT = 450;
const GAP = 12;
interface PositionedTask {
  task: Task;
  x: number;
  y: number;
  scale: number;
  colliding?: boolean;
}
interface LayoutParams {
  canvasWidth: number;
  canvasHeight: number;
  centerX: number;
  centerY: number;
}
const checkCollision = (
  x: number,
  y: number,
  radius: number,
  positions: PositionedTask[],
): boolean => {
  for (const pos of positions) {
    const otherRadius = (BUBBLE_SIZE[pos.task.priority] * pos.scale) / 2;
    const dx = x - pos.x;
    const dy = y - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = radius + otherRadius + GAP;
    if (distance < minDistance) {
      return true;
    }
  }
  return false;
};
const calculateLayout = (
  tasks: Task[],
  params: LayoutParams,
): { positions: PositionedTask[]; maxY: number } => {
  if (tasks.length === 0) return { positions: [], maxY: 0 };
  const { canvasWidth, canvasHeight, centerX, centerY } = params;
  const sortedByPriority = [...tasks].sort((a, b) => b.priority - a.priority);
  const positions: PositionedTask[] = [];
  // Calcular escala basada en cantidad de tareas
  const totalTasks = sortedByPriority.length;
  const baseScale = Math.max(0.6, 1 - (totalTasks - 1) * 0.04);
  for (let i = 0; i < sortedByPriority.length; i++) {
    const task = sortedByPriority[i];
    const baseSize = BUBBLE_SIZE[task.priority] * baseScale;
    const radius = baseSize / 2;
    let x = centerX;
    let y = centerY;
    let colliding = false;
    // Primera burbuja: va al centro
    if (i === 0) {
      positions.push({ task, x, y, scale: baseScale, colliding: false });
      continue;
    }
    // Buscar posición en espiral desde el borde de la primera burbuja
    let found = false;
    const startRadius = radius + GAP / 2;
    // Escala del radio basado en cantidad de tareas
    const radiusMultiplier = 1 + (totalTasks - 1) * 0.15;
    const maxSearchRadius = 300 * radiusMultiplier;
    for (let r = startRadius; r <= maxSearchRadius && !found; r += 8) {
      for (let angle = 0; angle < 360 && !found; angle += 12) {
        const radians = (angle * Math.PI) / 180;
        const px = centerX + Math.cos(radians) * r;
        const py = centerY + Math.sin(radians) * r;
        if (!checkCollision(px, py, radius, positions)) {
          x = px;
          y = py;
          found = true;
        }
      }
    }
    // Si no encontró lugar
    if (!found) {
      colliding = true;
      // Buscar en cualquier lugar
      for (let attempt = 0; attempt < 200 && !found; attempt++) {
        const px = Math.random() * (canvasWidth - baseSize) + baseSize / 2;
        const py = Math.random() * (canvasHeight - baseSize) + baseSize / 2;
        if (!checkCollision(px, py, radius, positions)) {
          x = px;
          y = py;
          found = true;
        }
      }
    }
    positions.push({ task, x, y, scale: baseScale, colliding });
  }
  // Calcular el maxY para determinar la altura necesaria
  let maxY = 0;
  for (const pos of positions) {
    const bubbleRadius = (BUBBLE_SIZE[pos.task.priority] * pos.scale) / 2;
    maxY = Math.max(maxY, pos.y + bubbleRadius);
  }
  return { positions, maxY };
};
export function BubbleCanvas({
  tasks,
  statusFilter,
  onBubblePress,
  onToggleComplete,
}: BubbleCanvasProps) {
  const insets = useSafeAreaInsets();
  const canvasDimensions = useMemo(() => {
    const canvasWidth = BASE_CANVAS_WIDTH;
    const canvasHeight = BASE_CANVAS_HEIGHT;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    return { canvasWidth, canvasHeight, centerX, centerY };
  }, []);
  const { positions: positionedTasks, maxY } = useMemo(
    () => calculateLayout(tasks, canvasDimensions),
    [tasks, canvasDimensions],
  );
  // Canvas height suficiente para todas las burbujas + padding
  const canvasHeight = Math.max(BASE_CANVAS_HEIGHT, maxY + 50);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        tasks.length === 0 && styles.emptyContent,
      ]}
      showsVerticalScrollIndicator={true}
    >
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No tasks yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap + to create your first task
          </Text>
        </View>
      ) : (
        <View style={[styles.canvas, { height: canvasHeight }]}>
          {positionedTasks.map(({ task, x, y, scale, colliding }, index) => {
          const bubbleSize = BUBBLE_SIZE[task.priority] * scale;
          const radius = bubbleSize / 2;
          const finalX = x - radius;
          const finalY = y - radius;
          const zIndex = index + 1;
          
          // Si está completada Y no estamos en el tab "Done", mostrar color desaturado
          const isCompleted = task.completed;
          const showDesaturated = isCompleted && statusFilter !== "completed";
          
          const bubbleColor = showDesaturated
            ? "#B5B5B5" // Color gris para completadas fuera de Done
            : task.category
              ? CATEGORY_COLORS[task.category]
              : NO_CATEGORY_COLOR;

          const handleDoubleTap = () => {
            // Si NO está completada, marcar
            if (!task.completed) {
              onToggleComplete(task.id, true);
            }
            // Si está completada Y estamos en tab "Done", desmarcar
            else if (statusFilter === "completed") {
              onToggleComplete(task.id, false);
            }
            // Si está completada pero NO estamos en Done, no hacer nada
          };

          return (
            <BubbleItem
              key={task.id}
              bubbleId={task.id}
              task={task}
              onPress={() => onBubblePress(task)}
              onDoubleTap={handleDoubleTap}
              color={bubbleColor}
              scale={scale}
              index={index}
              offsetX={finalX}
              offsetY={finalY}
              zIndex={zIndex}
              colliding={colliding}
            />
          );
        })}
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  canvas: {
    width: BASE_CANVAS_WIDTH,
    alignSelf: "center",
  },
});
