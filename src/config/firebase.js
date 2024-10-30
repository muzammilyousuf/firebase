// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp, collection, addDoc, getDoc, getDocs, updateDoc, serverTimestamp, arrayUnion, arrayRemove, increment, deleteDoc, deleteField, } from "firebase/firestore";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4-oubv8yoMs6V5EGC0zvOXz92lF2eOU8",
  authDomain: "fir-23f49.firebaseapp.com",
  projectId: "fir-23f49",
  storageBucket: "fir-23f49.appspot.com",
  messagingSenderId: "190091871310",
  appId: "1:190091871310:web:903c66f9ae7b17c667ef1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const storage = getStorage();

export { auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, sendEmailVerification, db, doc, setDoc, Timestamp, collection, addDoc, getDoc, getDocs, updateDoc, serverTimestamp, arrayUnion, arrayRemove, increment, deleteDoc, deleteField, storage, ref, uploadBytes, uploadBytesResumable, getDownloadURL }