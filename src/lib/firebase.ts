// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHjMCwvNeX8w9n3M4bJ3KdarkybZsf83o",
  authDomain: "studio-6431704675-6ab18.firebaseapp.com",
  projectId: "studio-6431704675-6ab18",
  appId: "1:806000673656:web:fe09f249bac4332c23be8d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
