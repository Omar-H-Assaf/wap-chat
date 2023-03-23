const express = require('express');
const router = express.Router();
const path = require("path");




// Import the Firebase SDK
const firebase = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getDatabase, ref, update } = require('firebase/database');

const firebaseConfig = require('../firebaseConfig');
const database = getDatabase(firebase.initializeApp(firebaseConfig));
const auth = getAuth();

router.get("/",function(req,res,next){
    res.clearCookie('jwt');
    res.sendFile(path.join(__dirname,"../","views","login.html"));
});
  
router.post("/", function(req,res,next){
    const email = req.body.email;
    const password = req.body.password;
    
    signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in 
              const user = userCredential.user;
      
              const dt = new Date();
               update(ref(database, 'users/' + user.uid),{
                last_login: dt,
              });
              let currentUser = {uid:user.uid,userName:user.displayName}
              res.cookie('currentUser',currentUser);

                res.cookie('jwt', user.accessToken);
                res.send("success");
                
            })
            .catch((error) => {
                res.send(error.message);
        });
})

module.exports = router;
