// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP8qfhpDqTPtv8A9qbKpZn5HkvUN9VNTQ",
  authDomain: "do-math-make-money-ce133.firebaseapp.com",
  projectId: "do-math-make-money-ce133",
  storageBucket: "do-math-make-money-ce133.appspot.com",
  messagingSenderId: "811763315162",
  appId: "1:811763315162:web:66d36850b4f0b51654d0e3",
  measurementId: "G-SDLCG8CY5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

//Auth
const auth = getAuth();

export {auth};

export default db;