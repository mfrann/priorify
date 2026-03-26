import type { Priority } from "@/features/tasks/types/task";

// =============================================================================
// PRIORITY COLORS (for task priority bars)
// =============================================================================
export const PRIORITY_COLORS: Record<number, string> = {
  1: "#B5D8EB",
  2: "#D4C4E8",
  3: "#F0C4B8",
};

// =============================================================================
// BUBBLE SIZING (based on priority)
// =============================================================================
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

// =============================================================================
// CATEGORY COLORS (for bubbles)
// =============================================================================
export const CATEGORY_COLORS = {
  WORK: "#93C5FD",      // Blue
  PERSONAL: "#C4B5FD",  // Violet
  STUDY: "#6EE7B7",     // Green (darker for contrast)
  HEALTH: "#FDA4AF",    // Rose
  FUN: "#FCD34D",       // Amber (darker for contrast)
};

export const CATEGORY_LABELS = {
  WORK: "Work",
  PERSONAL: "Personal",
  STUDY: "Study",
  HEALTH: "Health",
  FUN: "Fun",
};

export const NO_CATEGORY_COLOR = "#D1D5DB";

// =============================================================================
// SEMANTIC COLORS (UI components)
// =============================================================================
export const COLORS = {
  // Primary
  primary: "#2563EB",
  primaryPressed: "#1D4ED8",
  primaryLight: "#DBEAFE",

  // Neutral
  background: "#FFFFFF",
  surface: "#F9FAFB",
  surfaceElevated: "#FFFFFF",

  // Text
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  textDisabled: "#9CA3AF",
  textInverse: "#FFFFFF",

  // Semantic
  success: "#10B981",
  successLight: "#D1FAE5",
  destructive: "#EF4444",
  destructiveLight: "#FEE2E2",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",

  // Interactive
  tabActive: "#1F2937",
  tabInactive: "#E5E7EB",
  tabTextActive: "#FFFFFF",
  tabTextInactive: "#6B7280",

  // Divider/Border
  divider: "#E5E7EB",
  border: "#D1D5DB",

  // Overlay
  overlay: "rgba(0,0,0,0.5)",

  // Shadow
  shadow: "#9CA3AF",
} as const;
