import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore/lite";

const firebaseConfig = {
    apiKey: "AIzaSyDPKCI9Ew0eJAHoP5cwkLBlVX0UpI35b2I",
    authDomain: "gdrive-1075b.firebaseapp.com",
    projectId: "gdrive-1075b",
    storageBucket: "gdrive-1075b.appspot.com",
    messagingSenderId: "762059447490",
    appId: "1:762059447490:web:929455c76d0a44547faf5b",
    measurementId: "G-ZV9LY837EC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);
const provider = new GoogleAuthProvider()

export { db, auth, storage, provider, signInWithPopup, collection };