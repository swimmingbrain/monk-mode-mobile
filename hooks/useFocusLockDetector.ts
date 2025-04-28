import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Brightness from 'expo-brightness';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

interface FocusLockDetectorResult {
  screenLocked: boolean;
  appSwitchDetected: boolean;
}

/**
 * Hook to detect if the app is in the background due to screen lock or app switching
 * 
 * @returns {FocusLockDetectorResult} Object containing screenLocked and appSwitchDetected states
 */
export const useFocusLockDetector = (): FocusLockDetectorResult => {
  const [screenLocked, setScreenLocked] = useState<boolean>(false);
  const [appSwitchDetected, setAppSwitchDetected] = useState<boolean>(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const brightnessCheckTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastBackgroundReason = useRef<'locked' | 'switched' | null>(null);
  const initialBrightness = useRef<number | null>(null);
  const isInitialized = useRef<boolean>(false);

  // Get initial brightness when the hook is first used
  useEffect(() => {
    const getInitialBrightness = async () => {
      try {
        initialBrightness.current = await Brightness.getSystemBrightnessAsync();
        console.log('Initial brightness:', initialBrightness.current);
        isInitialized.current = true;
      } catch (error) {
        console.error('Error getting initial brightness:', error);
        isInitialized.current = true; // Still mark as initialized even if there's an error
      }
    };

    getInitialBrightness();
  }, []);

  useEffect(() => {
    // Keep the screen awake when the hook is active
    activateKeepAwake();
    console.log('Keep awake activated');

    // Clean up function to deactivate keep awake when the hook is unmounted
    return () => {
      deactivateKeepAwake();
      console.log('Keep awake deactivated');
      if (brightnessCheckTimeout.current) {
        clearTimeout(brightnessCheckTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      console.log('App state changed in hook:', { 
        from: appState.current, 
        to: nextAppState,
        isInitialized: isInitialized.current
      });
      
      // App has come to the foreground
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App came to foreground, last reason:', lastBackgroundReason.current);
        
        // Maintain the last known state when coming back to foreground
        if (lastBackgroundReason.current === 'locked') {
          console.log('Restoring locked state');
          setScreenLocked(true);
          setAppSwitchDetected(false);
        } else if (lastBackgroundReason.current === 'switched') {
          console.log('Restoring switched state');
          setScreenLocked(false);
          setAppSwitchDetected(true);
        } else {
          // Reset states if we don't have a last known state
          console.log('No last known state, resetting');
          setScreenLocked(false);
          setAppSwitchDetected(false);
        }
      }
      
      // App has gone to the background
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log('App went to background');
        
        // Clear any existing timeout
        if (brightnessCheckTimeout.current) {
          clearTimeout(brightnessCheckTimeout.current);
        }

        // Set a small timeout to allow the screen to potentially lock
        brightnessCheckTimeout.current = setTimeout(async () => {
          if (!isInitialized.current) {
            console.log('Hook not yet initialized, skipping brightness check');
            return;
          }
          
          try {
            // Get the current screen brightness
            const brightness = await Brightness.getSystemBrightnessAsync();
            console.log('Background brightness:', brightness);
            
            // If brightness is very low compared to initial brightness, assume screen is locked
            const brightnessThreshold = 0.05;
            const relativeBrightnessThreshold = initialBrightness.current ? initialBrightness.current * 0.2 : brightnessThreshold;
            
            if (brightness < relativeBrightnessThreshold) {
              console.log('LOCKED - Brightness:', brightness, 'Threshold:', relativeBrightnessThreshold);
              setScreenLocked(true);
              setAppSwitchDetected(false);
              lastBackgroundReason.current = 'locked';
            } else {
              // If brightness is normal, assume user switched apps
              console.log('NO FOCUS - Brightness:', brightness, 'Threshold:', relativeBrightnessThreshold);
              setScreenLocked(false);
              setAppSwitchDetected(true);
              lastBackgroundReason.current = 'switched';
            }
          } catch (error) {
            console.error('Error checking brightness:', error);
            // Default to app switch if we can't determine
            setScreenLocked(false);
            setAppSwitchDetected(true);
            lastBackgroundReason.current = 'switched';
          }
        }, 500); // 500ms delay to allow screen to potentially lock
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return { screenLocked, appSwitchDetected };
}; 