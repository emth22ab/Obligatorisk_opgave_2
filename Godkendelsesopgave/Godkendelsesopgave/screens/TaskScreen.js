import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Liste over standardopgaver
const defaultTasks = ["Skraldespanden skal tømmes", "Computeren virker ikke", "Toilettet er stoppet"];

export default function TaskScreen({ route, navigation }) {
  const { floor, room } = route.params; // Henter floor og room fra navigationens params
  const [selectedTask, setSelectedTask] = useState(null); // Holder styr på den valgte prædefinerede opgave
  const [customComment, setCustomComment] = useState(""); // Holder styr på brugerens egen kommentar

  // Funktion til at vælge en opgave
  const handleTaskSelect = (task) => {
    setSelectedTask(task === selectedTask ? null : task);
  };

  // Funktion til at sende data til Firestore
  const handleSend = async () => {
    const db = getFirestore(); // Initialiserer Firestore
    const auth = getAuth(); // Initialiserer Firebase Authentication
    const user = auth.currentUser; // Henter den nuværende bruger

    try {
      // Opretter et nyt dokument i "tasks"-samlingen med detaljer om opgaven
      await addDoc(collection(db, "tasks"), {
        campus: "Solbjerg Plads", // Kan ændres til dynamisk campusvalg
        floor: floor,
        room: room,
        task: selectedTask, // Gemmer den valgte prædefinerede opgave
        newTask: customComment || null, // Gemmer brugerens kommentar, hvis den findes
        user: user.email, // Gemmer brugerens email
        timestamp: new Date(), // Tidspunkt for rapporteringen
      });

      // Viser en besked til brugeren efter vellykket indsendelse
      Alert.alert(
        "Tak for input!",
        "Det vil blive fikset hurtigst muligt. Sammen kan vi opretholde CBS, som den bedste institution."
      );
      navigation.goBack(); // Navigerer tilbage til forrige skærm
    } catch (error) {
      // Viser en fejlmeddelelse, hvis indsendelsen fejler
      Alert.alert("Fejl", "Noget gik galt med at sende din forespørgsel. Prøv igen senere.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Du har valgt lokale <Text style={styles.roomText}>{room}</Text></Text>
      <Text style={styles.subHeader}>Vælg gerne en mangel fra listen herunder, eller skriv selv i feltet herunder</Text>

      {/* Viser prædefinerede opgaver som knapper */}
      {defaultTasks.map((task, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.taskButton,
            selectedTask === task ? styles.taskButtonSelected : null, // Marker valgt opgave
          ]}
          onPress={() => handleTaskSelect(task)}
        >
          <Text style={styles.taskButtonText}>{task}</Text>
        </TouchableOpacity>
      ))}

      {/* Tekstfelt til brugerens egen kommentar */}
      <TextInput
        style={styles.input}
        placeholder="Forklar selv her..."
        value={customComment}
        onChangeText={setCustomComment}
      />

      {/* Send-knap */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>Send!</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styling af komponenter
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  roomText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  subHeader: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  taskButton: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: 'center',
  },
  taskButtonSelected: {
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
  },
  taskButtonText: {
    fontSize: 16,
  },
  input: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#add8e6',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
