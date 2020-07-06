// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDsyF8l7V4_7nfhDy9z6xmd3l5sLPT8HWo",
	authDomain: "smackchat-f467b.firebaseapp.com",
	databaseURL: "https://smackchat-f467b.firebaseio.com",
	projectId: "smackchat-f467b",
	storageBucket: "smackchat-f467b.appspot.com",
	messagingSenderId: "798590974060",
	appId: "1:798590974060:web:19c40c4c359b059980c049"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firebaseDb = firebaseApp.database();

export { firebaseAuth, firebaseDb }