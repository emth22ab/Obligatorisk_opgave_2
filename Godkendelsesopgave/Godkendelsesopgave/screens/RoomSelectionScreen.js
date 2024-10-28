import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Liste over rum baseret på etage
const roomsByFloor = {
  "Stuen": ["S16", "S15", "S14", "S13", "S12", "S11", "S10", "S09", "S08", "S07", "S06", "S05", "S04", "S03", "S02", "S01", "Toilet S.1", "Toilet S.2", "Toilet S.3", "Toilet S.4"],
  "1. sal": ["116", "115", "114", "113", "112", "111", "110", "109", "108", "107", "106", "105", "104", "103", "102", "101", "Toilet 1.1", "Toilet 1.2", "Toilet 1.3", "Toilet 1.4"],
  "2. sal": ["216", "215", "214a", "214b", "213", "212", "211", "210", "209", "208", "207", "206", "205", "204", "203", "202", "201", "A220", "A221", "D220", "C204", "D244", "D245", "Toilet 2.1", "Toilet 2.2", "Toilet 2.3", "Toilet 2.4"],
  "3. sal": ["C305", "D330", "B310", "B311", "B320", "B301A333", "Toilet 3.1", "Toilet 3.2", "Toilet 3.3", "Toilet 3.4"],
  "4. sal": ["D440", "D436", "D439", "D420", "Toilet 4.1", "Toilet 4.2", "Toilet 4.3", "Toilet 4.4"],
  "5. sal": ["Toilet 5.1", "Toilet 5.2", "Toilet 5.3", "Toilet 5.4", "A532"]
};

export default function RoomSelectionScreen({ route, navigation }) {
  const { floor } = route.params;

  // Håndter valg af rum
  const handleRoomPress = (room) => {
    navigation.navigate("TaskScreen", { floor, room });
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
      <Text style={styles.title}>Vælg dit lokale på {floor}</Text>
      <View style={styles.roomGrid}>
        {roomsByFloor[floor]?.map((room, index) => (
          <TouchableOpacity key={index} style={styles.roomButton} onPress={() => handleRoomPress(room)}>
            <Text style={styles.roomButtonText}>{room}</Text>
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
    paddingTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  roomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  roomButton: {
    width: '20%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  roomButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  cameraIcon: {
    marginRight: 15,
  },
});
