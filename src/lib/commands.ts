import { ref, set, serverTimestamp, type Database } from "firebase/database";

export async function sendBuzzerCommand(database: Database, deviceId: string, value: boolean) {
  try {
    const commandRef = ref(database, `commands/${deviceId}`);
    await set(commandRef, {
      buzzer: value,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending buzzer command: ", error);
    throw error;
  }
}
