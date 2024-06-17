import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBezV7kDRlJ_pI5kuW1tTyHRP2dE61h_uI",
  authDomain: "mystack-717ad.firebaseapp.com",
  projectId: "mystack-717ad",
  storageBucket: "mystack-717ad.appspot.com",
  messagingSenderId: "279533048444",
  appId: "1:279533048444:web:9da61f01e60bd763256ff9",
  measurementId: "G-NRFG3VNKNK",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
