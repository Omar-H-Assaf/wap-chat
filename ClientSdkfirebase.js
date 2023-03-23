// Import the Firebase SDK
const firebase = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } = require('firebase/auth');
const { getDatabase, set, ref, update } = require('firebase/database');


const firebaseConfig = require('./firebaseConfig');
const app = firebase.initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();


module.exports = {auth,app,database,signInWithEmailAndPassword,set, ref, update};