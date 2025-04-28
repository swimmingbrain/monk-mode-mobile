import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusLockDetector } from '@/hooks/useFocusLockDetector';
import { AppState } from 'react-native';

/**
 * A demo component that shows how to use the useFocusLockDetector hook
 */
const FocusLockDemo = () => {
  const { screenLocked, appSwitchDetected } = useFocusLockDetector();
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isRunning, setIsRunning] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);
  const lastActiveTimeRef = useRef<number>(Date.now());
  const lastAppStateRef = useRef<string>(AppState.currentState);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Start the timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
  };

  // Stop the timer
  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Initialize timer
  useEffect(() => {
    // Always start the timer when the component mounts
    startTimer();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle focus state changes
  useEffect(() => {
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

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (lastAppStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came back to foreground
        const now = Date.now();
        const timeDiff = Math.floor((now - lastActiveTimeRef.current) / 1000);
        
        if (appSwitchDetected) {
          setWelcomeMessage("Timer was stopped while you lost focus");
          // Restore the last timer value when coming back from app switch
          setTimer(lastTimeRef.current);
        } else if (screenLocked) {
          setWelcomeMessage("Timer was counting while your phone was asleep");
          // Add the time that passed while the app was in background
          setTimer(prev => prev + timeDiff);
        }
        
        // Always start the timer when coming back to foreground
        startTimer();
        
        // Clear welcome message after 5 seconds
        setTimeout(() => {
          setWelcomeMessage(null);
        }, 5000);
      } else if (lastAppStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App going to background
        lastActiveTimeRef.current = Date.now();
        
        if (screenLocked) {
          // Keep the timer running in the background when screen is locked
          // We'll update the timer when the app comes back to foreground
        } else if (appSwitchDetected) {
          // Save the current timer value when switching apps
          lastTimeRef.current = timer;
          stopTimer();
        }
      }
      
      lastAppStateRef.current = nextAppState;
    };

    // Set up app state listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [screenLocked, appSwitchDetected, timer]);

  // Set welcome message based on focus state
  useEffect(() => {
    if (screenLocked) {
      setWelcomeMessage("Timer is running while your phone is asleep");
    } else if (appSwitchDetected) {
      setWelcomeMessage("Timer is paused because you switched apps");
    } else {
      setWelcomeMessage(null);
    }
  }, [screenLocked, appSwitchDetected]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus Lock Detector Demo</Text>
      
      {welcomeMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{welcomeMessage}</Text>
        </View>
      )}
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Timer:</Text>
        <Text style={styles.timerValue}>{formatTime(timer)}</Text>
        <Text style={styles.timerStatus}>
          {isRunning ? 'Running' : 'Paused'}
        </Text>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Current Status:</Text>
        <Text style={[
          styles.statusValue,
          screenLocked ? styles.locked : appSwitchDetected ? styles.noFocus : styles.active
        ]}>
          {screenLocked 
            ? 'Screen Locked (User Still Focusing)' 
            : appSwitchDetected 
              ? 'App Switch Detected (User Lost Focus)' 
              : 'App Active'}
        </Text>
      </View>
      
      <Text style={styles.instructions}>
        Try these actions to see the detector in action:
      </Text>
      <Text style={styles.instructionItem}>• Lock your screen</Text>
      <Text style={styles.instructionItem}>• Switch to another app</Text>
      <Text style={styles.instructionItem}>• Return to this app</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  messageText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  timerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  timerValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timerStatus: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  statusContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locked: {
    color: 'green',
  },
  noFocus: {
    color: 'red',
  },
  active: {
    color: 'blue',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 10,
  },
  instructionItem: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
  },
});

export default FocusLockDemo; 