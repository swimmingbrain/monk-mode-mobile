# Focus Lock Detector Hook

This hook provides a reliable way to detect the difference between:
1. The app running in the background because the screen is locked (user is still focusing)
2. The app running in the background because the user switched to another app (user lost focus)

## Installation

Make sure you have the required dependencies:

```bash
npm install expo-keep-awake expo-brightness
```

## Usage

```tsx
import { useFocusLockDetector } from '@/hooks/useFocusLockDetector';

const MyComponent = () => {
  const { screenLocked, appSwitchDetected } = useFocusLockDetector();

  useEffect(() => {
    if (screenLocked) {
      console.log('Screen is locked - user is still focusing');
      // Handle screen locked state
    } else if (appSwitchDetected) {
      console.log('App switch detected - user lost focus');
      // Handle app switch state
    }
  }, [screenLocked, appSwitchDetected]);

  return (
    // Your component JSX
  );
};
```

## How It Works

The hook uses the following approach to detect the difference:

1. Uses `expo-keep-awake` to keep the screen awake during focus mode
2. Listens for AppState changes (active, background)
3. When AppState goes to background, it immediately reads screen brightness using `expo-brightness`
4. If brightness is close to 0 (threshold < 0.05), it assumes the screen was locked (user still focusing)
5. If brightness is still normal (>0.1), it assumes the user left the app (lost focus)

## Return Values

The hook returns an object with the following properties:

- `screenLocked`: Boolean indicating if the screen is locked (user is still focusing)
- `appSwitchDetected`: Boolean indicating if the user switched to another app (lost focus)

## Example

See the `FocusLockDemo` component in `components/FocusLockDemo.tsx` for a complete example of how to use this hook.

## Notes

- The hook automatically keeps the screen awake when active and deactivates it when unmounted
- The brightness check has a small delay (500ms) to allow the screen to potentially lock
- If there's an error reading brightness, it defaults to assuming an app switch occurred 