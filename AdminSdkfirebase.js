
var admin = require("firebase-admin");
const auth = require('firebase-admin-auth');

var serviceAccount = require("./fireKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-app-db39f-default-rtdb.firebaseio.com"
});



module.exports = {admin,auth};