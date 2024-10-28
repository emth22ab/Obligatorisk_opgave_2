import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Liste over etager
const floors = ["Stuen", "1. sal", "2. sal", "3. sal", "4. sal", "5. sal"];

export default function FloorSelectionScreen({ navigation }) {
  // Funktion til at håndtere valg af etage
  const handleFloorPress = (floor) => {
    Alert.alert(`Du har valgt: ${floor}`);
    navigation.navigate("RoomSelectionScreen", { floor });
  };

  // Opsætning af header med kameraikon (se bort fra dette, da det skulle bruges til QR-kode)
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.cameraIcon}>
          <MaterialIcons name="camera-alt" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hvilken sal befinder du dig på?</Text>
      <View style={styles.floorList}>
        {floors.map((floor, index) => (
          <TouchableOpacity key={index} style={styles.floorButton} onPress={() => handleFloorPress(floor)}>
            <Text style={styles.floorButtonText}>{floor}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  floorList: {
    width: '100%',
    alignItems: 'center',
  },
  floorButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  floorButtonText: {
    fontSize: 18,
    color: '#333',
  },
  cameraIcon: {
    marginRight: 15,
  },
});
