import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import "firebase/auth";
import * as firebaseui from "firebaseui";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCnZ9uhCc1U0OkxUQej2gzklBjjHaOawZ4",
  authDomain: "freebooks-0.web.app",
  projectId: "freebooks-0",
};

let app, db;

const initializeFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return { app, db };
};

export const { app: firebaseApp, db: firestoreDb } = initializeFirebase();
// import firebaseui from "firebaseui"; // Import Firebase UI
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// export { firebaseui };
//add Doc
// async function addDoc(userData) {
//   try {
//     // Add a new document with a generated ID
//     const docRef = await addDoc(collection(db, "users"), userData);
//     console.log("User added with ID:", docRef.id); // Firestore generates a unique ID
//   } catch (error) {
//     console.error("Error adding user:", error);
//   }
// }
