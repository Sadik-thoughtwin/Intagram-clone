import firebase from 'firebase';
  const firebaseConfig = {
    apiKey: "AIzaSyBBkLZ-HfHAEF3Uvp_LIu5radhmVKknYck",
    authDomain: "instagramproject-354f2.firebaseapp.com",
    databaseURL: "https://instagramproject-354f2-default-rtdb.firebaseio.com",
    projectId: "instagramproject-354f2",
    storageBucket: "instagramproject-354f2.appspot.com",
    messagingSenderId: "986523842806",
    appId: "1:986523842806:web:4f9d5a1b851c721516d4d7",
    measurementId: "G-PMR0E2XM83",
  };
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebaseApp.storage();
export { auth, provider, storage, db};