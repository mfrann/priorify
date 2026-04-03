# Future Features

---

## Academic Features (Universidad) 🎓

Priorify se enfoca en estudiantes universitarios. Todas las tareas son académicas por defecto, con soporte para materias, exámenes y horarios de clase.

---

### 1. Study Streaks 🔥

#### Descripción
Contador de días consecutivos en los que el estudiante completa al menos una tarea de categoría STUDY.

#### Comportamiento
| Día | Actividad | Streak |
|-----|-----------|--------|
| Lunes | Completó 1 tarea STUDY | 🔥 1 |
| Martes | Completó 1 tarea STUDY | 🔥 2 |
| Miércoles | No hizo nada académico | 💨 0 (se rompe) |

#### Lógica
- ✅ **Restaura streak** si completás al menos 1 tarea STUDY ese día
- ❌ **Se rompe** si no completás ninguna tarea STUDY
- 🔥 **Se muestra en Home** para motivar

#### Implementación
```typescript
// En taskStore
interface StudyStreak {
  currentStreak: number;
  lastStudyDate: string | null; // ISO date
}

// Cuando se completa una tarea STUDY
const updateStreak = (completedTask: Task) => {
  if (completedTask.category !== 'STUDY') return;
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = subtractDays(today, 1);
  
  if (lastStudyDate === today) return; // Ya estudió hoy
  if (lastStudyDate === yesterday) {
    currentStreak += 1; // Continúa racha
  } else {
    currentStreak = 1; // Reinicia racha
  }
  lastStudyDate = today;
};
```

#### UI
```
┌─────────────────────────────────┐
│  Priorify              🔥 12 días │
└─────────────────────────────────┘
```

#### Status
- [ ] Implementar en taskStore
- [ ] Mostrar streak en Home header
- [ ] Animación de celebración al aumentar streak

---

### 2. Categorías por Materia/Curso 📚

#### Descripción
En lugar de categoría genérica "STUDY", el usuario crea sus propias materias (Ej: "Matemática I", "Física", "Programación").

#### Modelo de Datos
```typescript
interface Course {
  id: string;
  name: string;
  color: string; // Color único para la materia
  initials: string; // "MAT1", "FIS", "PROG"
}

interface Task {
  // ... existentes
  courseId?: string; // Materia asociada
}
```

#### UI - Selector de Materias
```
┌─────────────────────────────────┐
│  MATERIA                        │
├─────────────────────────────────┤
│  🔵 Matemática I        [+]     │
│  🟢 Física             [+]     │
│  🟣 Programación        [+]     │
│  🟡 Economía            [+]     │
│  + Agregar materia              │
└─────────────────────────────────┘
```

#### CRUD de Materias
- [ ] Agregar materia (nombre + color picker)
- [ ] Editar materia
- [ ] Eliminar materia (mover tareas a "Sin materia")
- [ ] Reordenar materias

#### Status
- [ ] Crear modelo Course
- [ ] Crear courseStore
- [ ] Actualizar TaskForm con selector de materias
- [ ] Mostrar color de materia en bubbles

---

### 3. Tipos de Tarea Académica 📋

#### Descripción
Diferentes tipos de tareas académicas con iconos y colores distintivos.

#### Tipos
| Tipo | Icono | Color | Ejemplo |
|------|-------|-------|---------|
| TP | 📝 | Azul | "TP3 de integrales" |
| Parcial | 📄 | Rojo | "Parcial de Física" |
| Examen Final | 🎓 | Naranja | "Final de Matemática" |
| Quiz | ❓ | Verde | "Quiz de historia" |
| Tarea | 📌 | Púrpura | "Tarea de inglés" |
| Proyecto | 💻 | Cyan | "Proyecto final" |
| Lectura | 📖 | Gris | "Leer capítulo 5" |
| Otro | 📌 | Por defecto | "Algo" |

#### Modelo de Datos
```typescript
type AcademicTaskType = 
  | 'TP'        // Trabajo práctico
  | 'EXAM'      // Parcial
  | 'FINAL'     // Examen final
  | 'QUIZ'      // Quiz/Cortico
  | 'HOMEWORK'  // Tarea
  | 'PROJECT'   // Proyecto
  | 'READING'   // Lectura
  | 'OTHER';    // Otro

interface Task {
  // ... existentes
  taskType?: AcademicTaskType;
}
```

#### UI - Selector de Tipo
```
┌─────────────────────────────────┐
│  TIPO DE TAREA                  │
├─────────────────────────────────┤
│  📝 TP        📄 Parcial       │
│  🎓 Examen    ❓ Quiz          │
│  📌 Tarea     💻 Proyecto      │
│  📖 Lectura   📌 Otro          │
└─────────────────────────────────┘
```

#### Prioridad Visual
- Examen/Parcial → Burbuja más grande (prioridad alta)
- TP/Proyecto → Burbuja mediana
- Quiz/Lectura → Burbuja pequeña

#### Status
- [ ] Definir tipos y constantes
- [ ] Agregar taskType a Task
- [ ] Selector visual en TaskForm
- [ ] Mostrar icono en bubble y detail card

---

### 4. Calendario Académico 📅

#### Descripción
Calendario optimizado para el ciclo académico: exámenes, entregas, parciales.

#### Vistas
1. **Mes** - Vista general con dots de tareas
2. **Semana** - Vista actual, mejorada
3. **Día** - Agenda del día seleccionado

#### Indicadores Visuales
```
┌──────────────────────────────┐
│ ◀  Marzo 2026  🔥 15  ▶     │
│                              │
│  L  M  X  J  V  S  D        │
│  ●  ●●  ○  ●  ●●  ○  ○      │
│     📄     🎓                │
└──────────────────────────────┘
  ● = TP       📄 = Parcial
  🎓 = Examen  ❓ = Quiz
```

#### Funcionalidades
- [ ] Filtrar por tipo de tarea
- [ ] Filtrar por materia
- [ ] Ver exámenes próximos (banner)
- [ ] Recordatorios de exams (1 día antes, 1 semana antes)

#### Status
- [ ] Mejorar WeekView con más contexto
- [ ] Agregar vista de mes
- [ ] Integrar streak en calendario
- [ ] Banner de exams próximos

---

### 5. Horarios de Clase ⏰

#### Descripción
Los estudiantes ven sus horarios semanales de clases para context.

#### Modelo de Datos
```typescript
interface ClassSchedule {
  id: string;
  courseId: string;
  dayOfWeek: 0-6; // 0 = Lunes
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  room?: string;     // "Aula 201"
}
```

#### UI -Vista Semanal
```
┌─────────────────────────────────┐
│  HORARIO                        │
├─────────────────────────────────┤
│  LUNES                          │
│  09:00 - 10:30  Matemática I    │
│              Aula 201           │
│  14:00 - 16:00  Física         │
│              Lab 3               │
│                                  │
│  MARTES                         │
│  10:00 - 12:00  Programación    │
│              Lab 1               │
└─────────────────────────────────┘
```

#### Integración con Tareas
- Tareas de esa materia mostradas cerca del horario
- Recordatorios antes de clase

#### Status
- [ ] Crear modelo ClassSchedule
- [ ] Crear scheduleStore
- [ ] Pantalla de horarios
- [ ] Mostrar en Calendar

---

### 6. Recordatorios Inteligentes para Exams 🔔

#### Descripción
Notificaciones automáticas antes de exams y parciales.

#### Tipos de Recordatorios
| Tiempo | Mensaje |
|--------|---------|
| 7 días antes | "📅 Examen de Matemática I en 1 semana" |
| 1 día antes | "⏰ Recordatorio: Examen de Matemática I mañana" |
| 1 hora antes | "⏰ Examen de Matemática I en 1 hora" |

#### Lógica
```typescript
// Cuando se crea tarea tipo EXAM/PARCIAL
const scheduleExamReminders = (task: Task) => {
  const examDate = new Date(task.deadline);
  
  // 7 días antes
  scheduleNotification(examDate - 7 days, generateMessage(task, '7days'));
  
  // 1 día antes
  scheduleNotification(examDate - 1 day, generateMessage(task, '1day'));
  
  // 1 hora antes
  scheduleNotification(examDate - 1 hour, generateMessage(task, '1hour'));
};
```

#### Status
- [ ] Usar expo-notifications
- [ ] Programar recordatorios al crear tarea
- [ ] Cancelar si se elimina tarea
- [ ] Configurable en Settings

---

### 7. Dashboard Académico 📊

#### Descripción
Vista con métricas académicas para motivación y seguimiento.

#### Métricas
```
┌─────────────────────────────────┐
│  📊 TU PROGRESO                 │
├─────────────────────────────────┤
│  🔥 Racha actual: 12 días       │
│  📝 Tareas completadas: 45      │
│  📄 Parciales aprobados: 3/4     │
│  📚 Materias activas: 5          │
│  ⭐ Promedio: 8.5               │
└─────────────────────────────────┘
```

#### Gráficos
- [ ] Gráfico de tareas por semana (barras)
- [ ] Distribución por materia (pie chart)
- [ ] Heatmap de productividad
- [ ] Comparación con semana anterior

#### Gamificación
- Medallas por achievements:
  - 🏆 "Primera racha de 7 días"
  - 📚 "100 tareas completadas"
  - 🎓 "Primer parcial aprobado"
  - 🔥 "30 días de racha"

#### Status
- [ ] Pantalla de dashboard
- [ ] Calcular métricas
- [ ] Gráficos básicos
- [ ] Sistema de achievements

---

## Features Técnicas

## Swipe Navigation for Status Tabs

### Description
Implement swipe gestures on the bubble canvas to navigate between status tabs (All/Active/Done).

### Current Behavior
- Swipe left/right on the bubble canvas changes tabs
- However, it conflicts with the native swipe-back gesture on iOS/Android (edge swipe for navigation)

### Technical Solution
Use `simultaneousWithExternalGesture` to allow both gestures to work together, or:

Ignore gestures that start near screen edges (first 20px) to preserve the native navigation gesture:

```typescript
const panGesture = Gesture.Pan()
  .onStart((event) => {
    // Ignore if starts at screen edge
    if (event.x < 20 || event.x > screenWidth - 20) {
      return;
    }
  })
  .activeOffsetX([-10, 10])
  .onEnd((event) => {
    // Handle tab change
  });
```

### Status
- [ ] Not implemented
- [x] Basic swipe logic in place
- [ ] Fix edge gesture conflict

---

## Calendar Improvements

### 1. Streak Counter 🔥

#### Description
Display current streak (consecutive days with completed tasks) on the calendar screen.

#### Implementation
```tsx
// Already have useStreak hook
// Add to calendar header:
<View style={styles.streakContainer}>
  <Text>🔥</Text>
  <Text>{streak} days</Text>
</View>
```

#### Status
- [ ] Not implemented
- [x] useStreak hook exists

---

### 2. Month Stats

#### Description
Show statistics below the week view:
- Total tasks completed this month
- Best day (most tasks completed)
- Average tasks per day

#### UI
```
┌─────────────────────────────────┐
│  ◀  March 2025  🔥 15 days  ▶ │
│                                 │
│  L   M   X   J   V   S   D    │
│  ●●   ●   ●●   ●   ●●   ○   ○ │
├─────────────────────────────────┤
│  📊 March Stats                │
│  Completed: 42                 │
│  Best day: Tuesday (8)        │
└─────────────────────────────────┘
```

#### Status
- [ ] Not implemented

---

### 3. Quick Month Selector

#### Description
Dropdown or modal to quickly jump to any month.

#### UI
```
◀  March 2025  ▼  ▶
       ↓
┌─────────────────┐
│  January 2025   │
│  February 2025   │
│  March 2025  ← current
│  April 2025      │
│  May 2025        │
└─────────────────┘
```

#### Status
- [ ] Not implemented

---

### 4. Full Week Agenda

#### Description
Below the week view, show a scrollable agenda of all days in the week.

#### UI
```
┌─────────────────────────────────┐
│  ◀  Week 12  ▶                 │
│  L   M   X   J   V   S   D    │
│  ●●   ●   ●●   ●   ●●   ○   ○  │
├─────────────────────────────────┤
│  ── Monday 17 ──────────────   │
│  ● 10:00  Team meeting          │
│  ● 14:00  Call client          │
│  ── Tuesday 18 ────────────   │
│  ● 09:00  Gym                  │
└─────────────────────────────────┘
```

#### Status
- [ ] Not implemented

---

### 5. Week Strip (Completed ✅)

Already implemented:
- Week navigation (◀ ▶)
- Day dots by category
- Selected day highlighting
- Today indicator
- Week number badge
- Month/year display

---

## Save Feedback

### Description
When a task is saved, there's no visual confirmation. Users might not realize the action completed.

### Current Behavior
- Form closes immediately after saving
- No toast, haptic, or animation to confirm

### Proposed Solution
Add visual feedback after save:

```typescript
// Option 1: Haptic feedback
import * as Haptics from 'expo-haptics';
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Option 2: Toast notification
Toast.show({
  message: 'Task saved!',
  type: 'success',
  duration: 2000,
});

// Option 3: Subtle animation on the saved bubble
```

### Status
- [ ] Not implemented

---

## Settings Export

### Description
Export tasks to a JSON file for backup.

### Current Behavior
- Shows an alert with task count
- No actual file export

### Proposed Solution
Use `expo-file-system` and `expo-sharing`:

```typescript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const exportTasks = async () => {
  const json = JSON.stringify(tasks, null, 2);
  const uri = FileSystem.documentDirectory + 'priorify-backup.json';
  await FileSystem.writeAsStringAsync(uri, json);
  await Sharing.shareAsync(uri);
};
```

### Status
- [ ] Not implemented
