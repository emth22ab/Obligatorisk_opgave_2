import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Text } from 'react-native';
import SignUpForm from './components/SignUpComponent';
import LogInForm from './components/LogInComponent';
import MainScreen from './screens/MainScreen';
import FloorSelectionScreen from './screens/FloorSelectionScreen';
import RoomSelectionScreen from './screens/RoomSelectionScreen';
import onAuthStateChange from './services/onAuthStateChange';
import TaskScreen from './screens/TaskScreen';
import * as Linking from 'expo-linking';

const Stack = createNativeStackNavigator();

// Firebase-konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBDUzhMtsMOrM-6EYTwDf_Xau1cISKhhYA",
  authDomain: "godkendelsesopgave1-f4256.firebaseapp.com",
  projectId: "godkendelsesopgave1-f4256",
  storageBucket: "godkendelsesopgave1-f4256.appspot.com",
  messagingSenderId: "440323829316",
  appId: "1:440323829316:web:5fe1b9e8780a5c44555611"
};

// Deep linking-konfiguration
const linking = {
  prefixes: ['exp://192.168.0.37:8089'],  // Opdater med din IP og port
  config: {
    screens: {
      MainScreen: 'home',
      FloorSelectionScreen: 'floor/:floorId',
      RoomSelectionScreen: {
        path: 'room/:floorId/:roomId',
        parse: {
          floorId: (floorId) => decodeURIComponent(floorId),
          roomId: (roomId) => decodeURIComponent(roomId),
        },
      },
      TaskScreen: 'task/:campus/:floor/:room',
    },
  },
};

export default function App() {
  const [user, setUser] = useState({ loggedIn: false });

  // Initialiser Firebase, hvis der ikke allerede er en app initialiseret
  useEffect(() => {
    if (getApps().length < 1) {
      initializeApp(firebaseConfig);
      console.log("Firebase initialized!");
    }
  }, []);

  // Initialiser Firestore
  const db = getFirestore();

  // Overvåg ændringer i brugerens login-status med Firebase's onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => unsubscribe();
  }, []);

  // AsyncStorage-eksempel på lagring af brugerens login-status (kan tilpasses)
  useEffect(() => {
    const storeUserStatus = async () => {
      try {
        await AsyncStorage.setItem('userStatus', JSON.stringify(user));
      } catch (error) {
        console.log("Error saving data to AsyncStorage", error);
      }
    };

    storeUserStatus();
  }, [user]);

  // Generér deeplink og QR-kode (logges til terminalen)
  useEffect(() => {
    const handleRoomDeeplink = () => {
      const roomDeepLink = Linking.createURL('room/2.%20sal/Toilet%202.1');
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(roomDeepLink)}&size=200x200`;
      console.log("Generated QR Code URL:", qrCodeUrl);  // QR-kode URL logges til terminalen
    };

    handleRoomDeeplink();
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        {user.loggedIn ? (
          <>
            <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FloorSelectionScreen" component={FloorSelectionScreen} options={{ title: 'Vælg Etage' }} />
            <Stack.Screen name="RoomSelectionScreen" component={RoomSelectionScreen} options={{ title: 'Vælg Lokale' }} />
            <Stack.Screen name="TaskScreen" component={TaskScreen} options={{ title: 'Meld En Mangel' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="AuthScreen" options={{ headerShown: false }}>
              {() => (
                <View style={styles.container}>
                  <Text style={styles.title}>Opret Bruger</Text>
                  <SignUpForm />

                  <View style={styles.spacer} />

                  <Text style={styles.title}>Log Ind</Text>
                  <LogInForm />

                  <StatusBar style="auto" />
                </View>
              )}
            </Stack.Screen>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  spacer: {
    height: 40,
  },
});
