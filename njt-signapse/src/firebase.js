// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6dLY7ZAoeFtNYJZAIVqdTW5487hLuN1U",

  authDomain: "njtransitsignapose.firebaseapp.com",

  projectId: "njtransitsignapose",

  storageBucket: "njtransitsignapose.appspot.com",

  messagingSenderId: "956798042623",

  appId: "1:956798042623:web:e182d6f9957cd2e3fb67ca",

  measurementId: "G-C8DW5K5DWJ",
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed

const db = getFirestore(app);

export { db };
