// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAj9iNOU7ThAR1150Q09093tpvnUNtTFr0",
    authDomain: "fir-f2bba.firebaseapp.com",
    projectId: "fir-f2bba",
    storageBucket: "fir-f2bba.appspot.com",
    messagingSenderId: "116986767069",
    appId: "1:116986767069:web:5ff19656491ac335705d34",
    measurementId: "G-2WRPCN3X6W"
  };

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
