// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDTfSXIMQhASVUoBDVRF3o7p8Jeq3r9D9g",
    authDomain: "augmented-rpg.firebaseapp.com",
    databaseURL: "https://augmented-rpg.firebaseio.com",
    projectId: "augmented-rpg",
    storageBucket: "augmented-rpg.appspot.com",
    messagingSenderId: "1076506960196",
    appId: "1:1076506960196:web:3636ba353c7103f6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.auth().signOut();

  let database= firebase.database();
