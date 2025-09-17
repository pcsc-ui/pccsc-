// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCDsIt3QPYbomA9EloT9yIFgdwrgdBexaM",
    authDomain: "pccsc-d77f5.firebaseapp.com",
    projectId: "pccsc-d77f5",
    storageBucket: "pccsc-d77f5.firebasestorage.app",
    messagingSenderId: "682264285649",
    appId: "1:682264285649:web:2a3c89ba0f9623caded0f0",
    measurementId: "G-2GT1JK5CF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Make available globally
window.firebaseApp = app;
window.firestoreDB = db;

// Function to add contact data to Firestore
window.addContactData = async (formData) => {
    try {
        const docRef = await addDoc(collection(db, "contacts"), formData);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Firebase Error:", error);
        return { success: false, error: error.message };
    }
};

console.log("Firebase initialized successfully!");
