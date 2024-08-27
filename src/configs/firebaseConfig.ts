import { initializeApp } from 'firebase/app';
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from 'firebase/auth';
import { ReactNode } from 'react';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  // apiKey: 'AIzaSyDHQo0DavO2HNyCR0OkKSQZvaBNCeP2VIQ',
  // authDomain: 'finalproject-a0ec5.firebaseapp.com',
  // projectId: 'finalproject-a0ec5',
  // storageBucket: 'finalproject-a0ec5.appspot.com',
  // messagingSenderId: '98734106034',
  // appId: '1:98734106034:web:c1712493315d30afc0b0ab',
  // measurementId: 'G-HKGL5B92XK',
  apiKey: 'AIzaSyDrDv1ptD7Yd59_7_VMNbTN98HhM7k5C0A',
  authDomain: 'sharebuy-fb990.firebaseapp.com',
  projectId: 'sharebuy-fb990',
  storageBucket: 'sharebuy-fb990.appspot.com',
  messagingSenderId: '883364976365',
  appId: '1:883364976365:web:b326b8d2cb5cae22379ee4',
  measurementId: 'G-7JL8485MY6',
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const providerGoogle = new GoogleAuthProvider();
const providerFacebook = new FacebookAuthProvider();

export { auth, providerGoogle, providerFacebook };
