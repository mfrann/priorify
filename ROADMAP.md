# 🫧 Priorify — Roadmap MVP

> Visual task manager where your priorities grow.
> **Deadline: Domingo 15 de marzo**

---

## 📊 Resumen de fases

| Fase | Nombre             | Día    | Estado |
| ---- | ------------------ | ------ | ------ |
| 0    | Setup & Estructura | Mar 10 |        |
| 1    | Lógica de datos    | Mié 11 |        |
| 2    | UI Core — Burbujas | Jue 12 |        |
| 3    | Formularios        | Vie 13 |        |
| 4    | Calendario         | Sáb 14 |        |
| 5    | Polish & Testing   | Dom 15 |        |

---

## 📦 Fase 0 — Setup & Estructura

**Día:** Martes 10 · **Tiempo estimado:** 1-2hs

### To-do

- [ ] Correr `npx create-expo-app@latest priorify`
- [ ] Entrar al proyecto: `cd priorify`
- [ ] Instalar dependencias: `npm install zustand @react-native-async-storage/async-storage`
- [ ] Crear carpeta `/types` y archivo `task.ts`
- [ ] Crear carpeta `/constants` y archivo `theme.ts`
- [ ] Crear carpeta `/services`
- [ ] Crear carpeta `/store`
- [ ] Crear carpeta `/hooks`
- [ ] Crear carpeta `/components`
- [ ] Verificar que corre: `npx expo start`

### 📁 Estructura objetivo

```
/app
/components
/hooks
/store
/services
/types
/constants
```

### 📝 Notas

> Los `npm warn` de librerías deprecadas son normales y no afectan el proyecto.
> Si falla `npm install` por red, reintentar con `npm install --prefer-offline`

---

## 🧠 Fase 1 — Lógica de datos

**Día:** Miércoles 11 · **Tiempo estimado:** 2-3hs

### To-do

- [ ] Crear `types/task.ts` con tipo `Task` y `Priority`
- [ ] Crear `constants/theme.ts` con `PRIORITY_COLORS` y `BUBBLE_SIZE`
- [ ] Crear `services/storage.ts` — wrapper de AsyncStorage (guardar, leer, borrar)
- [ ] Crear `store/taskStore.ts` con Zustand (CRUD completo)
- [ ] Crear `hooks/useTasks.ts` — conecta store + storage
- [ ] Test manual: crear una tarea y verificar que persiste al recargar

### 🔑 Tipos clave

```tsx
// types/task.ts
export type Priority = 1 | 2 | 3 | 4 | 5;

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  deadline?: string;
}
```

### 🎨 Colores y tamaños

```tsx
// constants/theme.ts
export const PRIORITY_COLORS = {
  1: "#A8D8EA", // Azul claro   → Baja
  2: "#A8E8C8", // Verde menta  → Media-baja
  3: "#C9B8E8", // Lavanda      → Media
  4: "#F5C8A0", // Durazno      → Media-alta
  5: "#E8A598", // Coral        → Alta
};

export const BUBBLE_SIZE = {
  1: 70,
  2: 90,
  3: 110,
  4: 135,
  5: 165,
};
```

---

## 🫧 Fase 2 — UI Core (Burbujas)

**Día:** Jueves 12 · **Tiempo estimado:** 3-4hs

### To-do

- [ ] Crear `components/BubbleItem.tsx` — círculo con color, tamaño y texto
- [ ] Crear `components/BubbleCanvas.tsx` — área donde flotan las burbujas
- [ ] Crear `app/index.tsx` — Home screen con burbujas conectadas al store
- [ ] Agregar contador "X active / Y done" en el header
- [ ] Agregar botón `+` flotante (FAB) en la esquina inferior derecha
- [ ] Verificar que las burbujas se renderizan con el tamaño correcto por prioridad

### 📝 Notas

> Drag & drop queda para v2. No implementar en MVP.
> Posicionamiento de burbujas puede ser semi-aleatorio con `position: absolute` en un área fija.

---

## 📝 Fase 3 — Formularios

**Día:** Viernes 13 · **Tiempo estimado:** 2-3hs

### To-do

- [ ] Crear `components/TaskForm.tsx` — modal para crear/editar tarea
- [ ] Agregar campo: título (TextInput)
- [ ] Agregar campo: descripción (opcional)
- [ ] Agregar selector de prioridad visual (burbujas de colores clickeables)
- [ ] Agregar date picker para deadline (opcional)
- [ ] Crear `components/TaskDetailCard.tsx` — card al tocar una burbuja
- [ ] Implementar marcar como completada (cambia opacidad/estilo de burbuja)
- [ ] Implementar borrar tarea (con confirmación Alert)
- [ ] Conectar formulario con `useTasks`

---

## 📅 Fase 4 — Calendario

**Día:** Sábado 14 · **Tiempo estimado:** 2-3hs

### To-do

- [ ] Instalar: `npm install react-native-calendars`
- [ ] Crear `app/calendar.tsx` — vista de calendario mensual
- [ ] Marcar días con deadlines en el calendario
- [ ] Crear `components/CompletedList.tsx` — lista "Upcoming Tasks" debajo del calendario
- [ ] Agregar bottom tab navigator (Home ↔ Calendar ↔ Settings)
- [ ] Crear `app/settings.tsx` — pantalla básica de ajustes

---

## 🎨 Fase 5 — Polish & Testing

**Día:** Domingo 15 · **Tiempo estimado:** 2hs

### To-do

- [ ] Revisar colores y espaciados vs diseño original
- [ ] Agregar empty state en Home (cuando no hay tareas)
- [ ] Agregar loading state mientras carga AsyncStorage
- [ ] Smoke test completo: crear → editar → completar → borrar
- [ ] Probar en dispositivo físico con Expo Go
- [ ] Corregir bugs encontrados

---

## 📦 Stack tecnológico

| Tecnología             | Uso                 |
| ---------------------- | ------------------- |
| Expo (SDK)             | Framework base      |
| React Native           | UI                  |
| TypeScript             | Tipado              |
| Zustand                | Estado global       |
| AsyncStorage           | Persistencia local  |
| Expo Router            | Navegación          |
| react-native-calendars | Vista de calendario |

---

## 🚫 Fuera del MVP (v2)

- Drag & drop de burbujas
- Notificaciones push
- Temas (dark/light mode)
- Sincronización en la nube
- Subtareas

---

_Última actualización: 10 de marzo, 2026_
