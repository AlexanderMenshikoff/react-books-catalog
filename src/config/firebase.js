// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA558jIUJbGPl7fOvw0hgULLTYNcz3YaoI",
  authDomain: "books-catalog-69fb0.firebaseapp.com",
  projectId: "books-catalog-69fb0",
  storageBucket: "books-catalog-69fb0.appspot.com",
  messagingSenderId: "708714331222",
  appId: "1:708714331222:web:603be45a8a9f4cf2228ff7",
  measurementId: "G-29M7TTY6PB",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
