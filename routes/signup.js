const express = require('express');
const router = express.Router();
const path = require("path");

// Import the Firebase SDK
const firebase = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getDatabase, set, ref, update } = require('firebase/database');

const firebaseConfig = require('../firebaseConfig');
const database = getDatabase(firebase.initializeApp(firebaseConfig));
const auth = getAuth();

router.get("/",function(req,res,next){
    res.sendFile(path.join(__dirname,"../","views","signup.html"));
});

router.post("/",function(req,res,next){
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        set(ref(database, 'users/' + user.uid),{
            username: username,
            email: email
        })
        updateProfile(auth.currentUser,{
          displayName: username
        })
        res.send("success");
    }).catch((error) => {
      const errorMessage = error.message;
      res.send(errorMessage)
    });
});

module.exports = router;
