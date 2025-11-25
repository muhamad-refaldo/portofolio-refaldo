import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDh95lyAZ1hbI-zaOAby6OdFX3CU0yLu8s",
  authDomain: "portfolio-refaldo.firebaseapp.com",
  projectId: "portfolio-refaldo",
  storageBucket: "portfolio-refaldo.firebasestorage.app",
  messagingSenderId: "795478965059",
  appId: "1:795478965059:web:160f7d38a0be224762cdf6",
  measurementId: "G-RVZ6E2YMV2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { auth, db, storage, googleProvider, signInWithEmailAndPassword };
