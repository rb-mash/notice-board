import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSjnNQ3hDmuv8lobu0k63mEmw_cdhXsOM",
  authDomain: "notice-boeard.firebaseapp.com",
  projectId: "notice-boeard",
  storageBucket: "notice-boeard.appspot.com",
  messagingSenderId: "130931894790",
  appId: "1:130931894790:web:ac3eaf270b589d283bb187",
  measurementId: "G-51NQ6PV12K"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore };
