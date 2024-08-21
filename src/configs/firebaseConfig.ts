import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDHQo0DavO2HNyCR0OkKSQZvaBNCeP2VIQ',
  authDomain: 'finalproject-a0ec5.firebaseapp.com',
  projectId: 'finalproject-a0ec5',
  storageBucket: 'finalproject-a0ec5.appspot.com',
  messagingSenderId: '98734106034',
  appId: '1:98734106034:web:c1712493315d30afc0b0ab',
  measurementId: 'G-HKGL5B92XK',
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const providerGoogle = new GoogleAuthProvider();
export { auth, providerGoogle };
