# Future Features

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
