import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyAy2RcrOV_iNjFUdDoQEgVjWwLi-rMHV6U",
  authDomain: "babbler-4f10a.firebaseapp.com",
  databaseURL: "https://babbler-4f10a.firebaseio.com",
  projectId: "babbler-4f10a",
  storageBucket: "babbler-4f10a.appspot.com",
  messagingSenderId: "961015969356",
  appId: "1:961015969356:web:0111653f60d2b98609e6e9",
  measurementId: "G-ZE6Y1HBR8Q",
});

export default firebaseConfig;
