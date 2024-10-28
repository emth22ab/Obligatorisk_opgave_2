import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { StyleSheet, View, Text } from 'react-native';
import SignUpForm from './components/SignUpComponent';
import LogInForm from './components/LogInComponent';
import MainScreen from './screens/MainScreen';  
import AuthScreen from './screens/AuthScreen';  
import ProfileScreen from './screens/ProfileScreen';  // Profilskærm

// Firebase-konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBDUzhMtsMOrM-6EYTwDf_Xau1cISKhhYA",
  authDomain: "godkendelsesopgave1-f4256.firebaseapp.com",
  projectId: "godkendelsesopgave1-f4256",
  storageBucket: "godkendelsesopgave1-f4256.appspot.com",
  messagingSenderId: "440323829316",
  appId: "1:440323829316:web:5fe1b9e8780a5c44555611"
};

// Opret Stack navigator
const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState({ loggedIn: false });

  // Initialiser Firebase, hvis der ikke allerede er en app initialiseret
  useEffect(() => {
    if (getApps().length < 1) {
      initializeApp(firebaseConfig);
      console.log("Firebase On!");
    }
  }, []);

  const auth = getAuth();

  // Overvåg ændringer i brugerens login-status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ loggedIn: true, email: currentUser.email });
      } else {
        setUser({ loggedIn: false });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Check om brugeren er logget ind, og vis den relevante skærm
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user.loggedIn ? (
          <>
            {/* Hovedskærm */}
            <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
            {/* Profileringsside */}
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profil' }} />
          </>
        ) : (
          <>
            {/* AuthScreen som indeholder SignUpForm og LogInForm */}
            <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
