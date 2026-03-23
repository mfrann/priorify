import type { Task } from "@/features/tasks/types/task";
import { BUBBLE_SIZE } from "@/shared/constants/theme";
import { Dimensions, StyleSheet, View } from "react-native";
import { BubbleItem } from "./BubbleItem";

interface BubbleCanvasProps {
  tasks: Task[];
  onBubblePress: (task: Task) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CANVAS_PADDING = 20;
const CANVAS_WIDTH = SCREEN_WIDTH - CANVAS_PADDING * 2;
const CANVAS_HEIGHT = SCREEN_HEIGHT - 280;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;
const MAX_RADIUS = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 2 - 50;

interface PositionedTask {
  task: Task;
  x: number;
  y: number;
  scale: number;
}

const GAP = 20;

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

const generateRandomPosition = (
  minRadius: number,
  maxRadius: number,
): { x: number; y: number } => {
  const angle = Math.random() * 2 * Math.PI;
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  return {
    x: CENTER_X + Math.cos(angle) * radius,
    y: CENTER_Y + Math.sin(angle) * radius,
  };
};

const calculateLayout = (tasks: Task[]): PositionedTask[] => {
  if (tasks.length === 0) return [];

  const sortedByPriority = [...tasks].sort((a, b) => b.priority - a.priority);

  const positions: PositionedTask[] = [];

  for (const task of sortedByPriority) {
    const baseSize = BUBBLE_SIZE[task.priority];
    const radius = baseSize / 2;
    let x = CENTER_X;
    let y = CENTER_Y;
    let attempts = 0;
    const maxAttempts = 50;

    if (positions.length > 0) {
      let found = false;

      for (let r = 0; r <= MAX_RADIUS && !found; r += 20) {
        for (let i = 0; i < 20 && !found; i++) {
          const pos = generateRandomPosition(r, r + 20);
          x = pos.x;
          y = pos.y;

          if (!checkCollision(x, y, radius, positions)) {
            found = true;
          }
          attempts++;

          if (attempts >= maxAttempts) break;
        }
      }

      if (!found) {
        for (let attempt = 0; attempt < 100; attempt++) {
          const pos = generateRandomPosition(0, MAX_RADIUS);
          if (!checkCollision(pos.x, pos.y, radius, positions)) {
            x = pos.x;
            y = pos.y;
            found = true;
            break;
          }
        }
      }
    }

    positions.push({ task, x, y, scale: 1 });
  }

  let maxRadius = 0;
  for (const pos of positions) {
    const bubbleRadius = (BUBBLE_SIZE[pos.task.priority] * pos.scale) / 2;
    const distFromCenter = Math.sqrt(
      Math.pow(pos.x - CENTER_X, 2) + Math.pow(pos.y - CENTER_Y, 2),
    );
    maxRadius = Math.max(maxRadius, distFromCenter + bubbleRadius);
  }

  if (maxRadius > MAX_RADIUS) {
    const scale = MAX_RADIUS / maxRadius;
    return positions.map((p) => ({
      ...p,
      scale: p.scale * scale,
    }));
  }

  return positions;
};

export function BubbleCanvas({ tasks, onBubblePress }: BubbleCanvasProps) {
  const positionedTasks = calculateLayout(tasks);

  return (
    <View style={styles.container}>
      <View style={styles.canvas}>
        {[...positionedTasks].reverse().map(({ task, x, y, scale }, index) => {
          const bubbleSize = BUBBLE_SIZE[task.priority] * scale;
          const radius = bubbleSize / 2;

          let finalX = x - radius;
          let finalY = y - radius;

          finalX = Math.max(
            CANVAS_PADDING,
            Math.min(CANVAS_WIDTH - bubbleSize - CANVAS_PADDING, finalX),
          );
          finalY = Math.max(
            CANVAS_PADDING,
            Math.min(CANVAS_HEIGHT - bubbleSize - CANVAS_PADDING, finalY),
          );

          return (
            <BubbleItem
              key={task.id}
              bubbleId={task.id}
              task={task}
              onPress={() => onBubblePress(task)}
              scale={scale}
              index={index}
              offsetX={finalX}
              offsetY={finalY}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    alignSelf: "center",
  },
});
