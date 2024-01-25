import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDH5lb-UFYBRzdP0YDbbCnT9Kafjh5pAlI",
  authDomain: "knot-7e288.firebaseapp.com",
  projectId: "knot-7e288",
  storageBucket: "knot-7e288.appspot.com",
  messagingSenderId: "136577932357",
  appId: "1:136577932357:web:c8a0cf46a2c4d7ddf6972c",
  measurementId: "G-ESXNM7VG5P"
};

const app = initializeApp(firebaseConfig);

// Firebase: Authentication, Storage, Cloud firestore(database)
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getFirestore(app);
