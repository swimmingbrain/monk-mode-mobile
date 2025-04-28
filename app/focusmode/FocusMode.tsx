import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { useFocusLockDetector } from "@/hooks/useFocusLockDetector";
import { AppState } from "react-native";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as ScreenOrientation from 'expo-screen-orientation';

// Define a background task name
const BACKGROUND_TIMER_TASK = 'BACKGROUND_TIMER_TASK';

// Register the background task
TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
  try {
    // This will be called periodically when the app is in the background
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const FocusMode = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { screenLocked, appSwitchDetected } = useFocusLockDetector();
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isRunning, setIsRunning] = useState(false); // Start with timer not running
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastAppStateRef = useRef<string>("active");
  const lastTimeRef = useRef<number>(0);
  const lastActiveTimeRef = useRef<number>(Date.now());
  const hasStartedRef = useRef<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isAndroid = Platform.OS === 'android';
  const lastStateChangeTime = useRef<number>(Date.now());

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Start the timer
  const startTimer = () => {
    console.log("Starting timer, current state:", { isRunning, timer });
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      console.log("Timer started");
    }
  };

  // Stop the timer
  const stopTimer = () => {
    console.log("Stopping timer, current state:", { isRunning, timer });
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      console.log("Timer stopped");
    }
  };

  // Show welcome message with animation
  const showWelcomeMessage = (message: string) => {
    setWelcomeMessage(message);
    
    // Reset animation value
    fadeAnim.setValue(0);
    
    // Animate in
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(4000), // Show for 4 seconds
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setWelcomeMessage(null);
    });
  };

  // Register background task
  useEffect(() => {
    const registerBackgroundTask = async () => {
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_TIMER_TASK, {
          minimumInterval: 1, // 1 second
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log('Background task registered');
      } catch (err) {
        console.error('Background task registration failed:', err);
      }
    };

    registerBackgroundTask();

    return () => {
      BackgroundFetch.unregisterTaskAsync(BACKGROUND_TIMER_TASK);
    };
  }, []);

  // Lock screen orientation to portrait on Android
  useEffect(() => {
    if (isAndroid) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
    
    return () => {
      if (isAndroid) {
        ScreenOrientation.unlockAsync();
      }
    };
  }, []);

  // Initialize timer when component mounts
  useEffect(() => {
    console.log("Component mounted, starting timer");
    // Always start the timer when the component mounts
    startTimer();
    hasStartedRef.current = true;
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle focus state changes
  useEffect(() => {
    console.log("Focus state changed:", { screenLocked, appSwitchDetected, isRunning });
    
    const now = Date.now();
    const timeSinceLastStateChange = now - lastStateChangeTime.current;
    lastStateChangeTime.current = now;
    
    if (screenLocked) {
      console.log("Screen is locked - user is still focusing");
      // Timer continues running when screen is locked
      startTimer();
      lastActiveTimeRef.current = Date.now();
    } else if (appSwitchDetected) {
      console.log("App switch detected - user lost focus");
      // Stop timer when user switches apps
      stopTimer();
      lastTimeRef.current = timer;
    }
  }, [screenLocked, appSwitchDetected]);

  // Handle app state changes for welcome message and timer
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      console.log("App state changed:", { 
        from: lastAppStateRef.current, 
        to: nextAppState, 
        screenLocked, 
        appSwitchDetected,
        isRunning,
        platform: Platform.OS
      });
      
      const now = Date.now();
      const timeSinceLastStateChange = now - lastStateChangeTime.current;
      
      if (lastAppStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came back to foreground
        const timeDiff = Math.floor((now - lastActiveTimeRef.current) / 1000);
        
        // For Android, if the time since last state change is very short (less than 1 second),
        // it's likely a screen lock rather than an app switch
        if (isAndroid && timeSinceLastStateChange < 1000 && !appSwitchDetected) {
          console.log("Android quick return detected, assuming screen lock");
          showWelcomeMessage("Welcome back! Timer was counting while your phone was asleep!");
          // Add the time that passed while the app was in background
          setTimer(prev => prev + timeDiff);
          startTimer();
        } else if (appSwitchDetected) {
          showWelcomeMessage("Welcome back! Timer was stopped while you lost focus!");
          // Restore the last timer value when coming back from app switch
          setTimer(lastTimeRef.current);
          startTimer();
        } else if (screenLocked) {
          showWelcomeMessage("Welcome back! Timer was counting while your phone was asleep!");
          // Add the time that passed while the app was in background
          setTimer(prev => prev + timeDiff);
          startTimer();
        } else {
          // Always start the timer when coming back to foreground
          console.log("App came back to foreground, starting timer");
          startTimer();
        }
      } else if (lastAppStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App going to background
        lastActiveTimeRef.current = Date.now();
        
        if (screenLocked) {
          // Keep the timer running in the background when screen is locked
          // We'll update the timer when the app comes back to foreground
          console.log("Screen locked, keeping timer running");
        } else if (appSwitchDetected) {
          // Save the current timer value when switching apps
          lastTimeRef.current = timer;
          stopTimer();
          console.log("App switch detected, stopping timer");
        } else if (isAndroid) {
          // On Android, assume it's a screen lock by default
          console.log("Android background, assuming screen lock");
          // Keep the timer running
        }
      }
      
      lastAppStateRef.current = nextAppState;
    };

    // Set up app state listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [screenLocked, appSwitchDetected, timer, isRunning]);

  const handlePress = () => {
    router.push("/");
  };

  return (
    <SafeAreaWrapper className="bg-black">
      <View className="flex items-center justify-center w-full h-full gap-10">
        {welcomeMessage && (
          <Animated.View 
            className="absolute top-10 left-0 right-0 z-10"
            style={{ opacity: fadeAnim }}
          >
            <View className="bg-secondary/20 p-4 rounded-lg mx-4">
              <Text className="text-secondary text-center">{welcomeMessage}</Text>
            </View>
          </Animated.View>
        )}
        
        <View className="flex items-center gap-6">
          <View className="bg-primary w-48 h-48 rounded-full flex items-center justify-center">
            <Text className="text-secondary text-4xl">{formatTime(timer)}</Text>
          </View>
          <Text className="text-secondary">0 XP gesammelt</Text>
        </View>
        <TouchableOpacity
          onPress={handlePress}
          className="flex flex-row items-center bg-secondary rounded-lg py-4 px-20"
        >
          <Text className="text-primary text-lg">aufgeben</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

export default FocusMode;
