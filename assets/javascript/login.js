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

  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //user signed in
        console.log('sign in successful')
        window.location = 'index.html'
        //send them to map page
      } else {
        //user is signed out
      }
  })

  // logic for sign up button
  $('#signUp').on('click', function (event) {
    event.preventDefault()
    let emailExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let email = $('#email').val();
    let password = $('#password').val();

    // creates a profile if it passes the tests
    if (emailExp.test(email) && password.length > 0) {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    } else {
        alert('invalid email or password');
    }
});

// logic for sign in
$('#signIn').on('click', function (event) {
    event.preventDefault()
    let email = $('#email').val();
    let password = $('#password').val();

    // checks types email and pass with firebase
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
    });
});