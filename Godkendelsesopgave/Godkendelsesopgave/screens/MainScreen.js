import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { getDistance, convertDistance } from 'geolib';
import { MaterialIcons } from '@expo/vector-icons';

// Liste over CBS-campusser med koordinater
const campuses = {
  "Dalgas Have": { latitude: 55.680, longitude: 12.533 },
  "Kilen": { latitude: 55.6805, longitude: 12.5275 },
  "Porcelænshaven": { latitude: 55.678, longitude: 12.525 },
  "Solbjerg Plads": { latitude: 55.6815, longitude: 12.532 },
  "Graduate House": { latitude: 55.681, longitude: 12.526 },
  "Flintholm": { latitude: 55.682, longitude: 12.515 },
  "Howitzvej": { latitude: 55.681, longitude: 12.524 },
  "Solbjergvej": { latitude: 55.6815, longitude: 12.532 },
  "CBS Eksamenshus": { latitude: 55.659, longitude: 12.621 },
  "Grundtvigsvej": { latitude: 55.684, longitude: 12.523 },
  "Peter Bangs Vej": { latitude: 55.680, longitude: 12.519 },
  "Finsensvej": { latitude: 55.677, longitude: 12.515 }
};

export default function MainScreen({ navigation }) {
  const [sortedCampuses, setSortedCampuses] = useState([]);
  const [closestCampus, setClosestCampus] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Hent brugerens placering og sorter campusser efter afstand
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Tilladelse til lokation blev nægtet');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      sortCampusesByDistance(location.coords);
    })();
  }, []);

  // Funktion til at sortere campusser efter afstand fra brugeren
  const sortCampusesByDistance = (userLocation) => {
    const campusDistances = Object.entries(campuses).map(([campusName, coordinates]) => {
      const distance = getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        coordinates
      );
      return { campusName, distance };
    });

    campusDistances.sort((a, b) => a.distance - b.distance);

    setClosestCampus(campusDistances[0].campusName);
    setSortedCampuses(campusDistances);
  };

  // Håndter valg af campus
  const handleCampusSelect = (campus) => {
    Alert.alert(
      "Valgt Campus",
      `Du har valgt ${campus}.`,
      [{ text: "OK", onPress: () => navigation.navigate("FloorSelectionScreen", { campus }) }]
    );
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
      <Text style={styles.title}>Vælg Campus</Text>
      {/* Viser forslag til nærmeste campus */}
      {closestCampus ? (
        <Text style={styles.suggestion}>
          Det ligner du er tættest på {closestCampus}. Du kan vælge det herunder.
        </Text>
      ) : errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <Text>Finder din placering...</Text>
      )}
      
      {/* Viser liste over campusser baseret på afstand */}
      {sortedCampuses.length > 0 && (
        <>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleCampusSelect(closestCampus)}
          >
            <Text style={styles.buttonText}>{closestCampus}</Text>
          </TouchableOpacity>

          <Text style={styles.subTitle}>Hvis ikke, kan du vælge herunder:</Text>

          {sortedCampuses.slice(1).map(({ campusName, distance }, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.button} 
              onPress={() => handleCampusSelect(campusName)}
            >
              <Text style={styles.buttonText}>
                {campusName}: {convertDistance(distance, 'km').toFixed(2)} km væk
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
}

// Styling

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  suggestion: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
  },
  cameraIcon: {
    marginRight: 15,
  },
});
