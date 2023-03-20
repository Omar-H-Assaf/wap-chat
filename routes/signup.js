const express = require('express');
const router = express.Router();
const path = require("path");




// Import the Firebase SDK
const firebase = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } = require('firebase/auth');
const { getDatabase, set, ref, update } = require('firebase/database');


const firebaseConfig = require('../firebaseConfig');
const app = firebase.initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();


router.get("/",function(req,res,next){
    res.sendFile(path.join(__dirname,"../","views","signup.html"));
});


router.post("/",function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        const user = userCredential.user;
  
        set(ref(database, 'users/' + user.uid),{
            username: username,
            email: email
        })
  
        console.log('user created!');
        console.log(user);
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
  
        console.log(error);
      
      });
  
       res.send("signup done")
});

module.exports = router;
