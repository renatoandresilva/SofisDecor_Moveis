import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDlNAD8mHGXJDuP1UMiOjYgAkSwdXBsEsE",
    authDomain: "sofisdecormoveis-59a34.firebaseapp.com",
    projectId: "sofisdecormoveis-59a34",
    storageBucket: "sofisdecormoveis-59a34.firebasestorage.app",
    messagingSenderId: "988820068108",
    appId: "1:988820068108:web:473ae65bf31ea1ce7edb29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };