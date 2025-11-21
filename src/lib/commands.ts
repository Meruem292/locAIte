import { ref, push, serverTimestamp, type Database } from "firebase/database";

export async function sendBuzzerCommand(database: Database, deviceId: string) {
  try {
    const commandsRef = ref(database, 'commands');
    await push(commandsRef, {
      deviceId: deviceId,
      buzzer: true,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending buzzer command: ", error);
    throw error;
  }
}
