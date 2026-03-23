# Priorify

Priorify is a visual task-prioritization app built with Expo and React Native. Tasks are represented as animated bubbles, where larger bubbles indicate higher priority.

## Stack

- Expo SDK 54
- React Native 0.81.5
- React 19.1.0
- TypeScript 5.9.2
- Zustand
- AsyncStorage

## Commands

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Architecture

```txt
app/                       Expo Router routes and screen composition
features/tasks/            Task domain code
  components/              Task-specific UI
  hooks/                   Task hooks
  services/                Task persistence
  store/                   Zustand state
  types/                   Task domain types
shared/                    Reusable cross-feature modules
  components/              Shared UI primitives
  constants/               Shared visual tokens
docs/                      Notes and design references
```

## Notes

- `app/` should stay thin and focus on route composition.
- Task-specific code should stay under `features/tasks/`.
- Reusable, domain-agnostic code should go in `shared/`.
- Archived experiments and design references belong in `docs/`.
