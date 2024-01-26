// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACjF2CkwQh5V_AnBqnLgYh1-w9Az9WhaQ",
  authDomain: "venue-booking-system-e6b2f.firebaseapp.com",
  projectId: "venue-booking-system-e6b2f",
  storageBucket: "venue-booking-system-e6b2f.appspot.com",
  messagingSenderId: "575828521972",
  appId: "1:575828521972:web:7d737f000d00278bf03fa1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)