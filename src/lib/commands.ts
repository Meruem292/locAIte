import { collection, addDoc, serverTimestamp, type Firestore } from "firebase/firestore";

export async function sendBuzzerCommand(firestore: Firestore, deviceId: string) {
  try {
    await addDoc(collection(firestore, 'commands'), {
      deviceId: deviceId,
      buzzer: true,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending buzzer command: ", error);
    throw error;
  }
}
