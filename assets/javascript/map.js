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

var database = firebase.database();

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var userId;
var currentXP;
let quests = [];

//takes a number and updates the database
function addExperience(xp) {
  let xpadder = currentXP + xp;
  database.ref('users/' + userId).set({
    experience: xpadder
  })
}

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    //user signed in
    userId = firebase.auth().currentUser.uid;


  } else {

    window.location = 'login.html'
  }
  database.ref('users/' + userId).on("value", function (snapshot) {
    if (snapshot.val() === null) {
      database.ref('users/' + userId).set({
        experience: 0
      })
    }
    if (snapshot.val().experience >= 0) {
      currentXP = snapshot.val().experience;
      console.log('we got here');
      $('#profPoints').text(currentXP);
      console.log(currentXP);
      $('#cardPoints').text(currentXP);
    }

  }, function (errorObject) {

    console.log("The read failed: " + errorObject.code);
  })
})

const points = [50,75,100];
var map, infoWindow;
var goalUp = false;
setTimeout(
  function initMap() {
    
  map = new google.maps.Map(document.getElementById('mapContainer'), {
    center: { lat: 47.6191119, lng: -122.31940750000001 },
    zoom: 15
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var profileMarker = new google.maps.Marker({
      position: null,
      map: map,
      icon: iconBase + 'hiker_maps.png'
      
    });
    
    var contentStringProfile = '<div id="profileCard" class="card" style="width: 10rem;">' + '<div class="card-body text-center">' + '<img src="assets/images/pacman.png" width="45" height="30" class="d-inline-block align-top" alt="treasure">' + '<br>' + '<br>' + '<h6 class="card-subtitle mb-2 text-muted"> Profile</h6>' + '<p class="card-text">Points: ' + "<span id='cardPoints'>" + currentXP + "</span>" + '</p>' + '<a href="profile.html" class="card-link">Go to my profile</a>' + '</div>' + '</div>';
    var infoWindow = new google.maps.InfoWindow({
      content: '<div id="profileCard" class="card" style="width: 10rem;">' + '<div class="card-body text-center">' + '<img src="assets/images/pacman.png" width="45" height="30" class="d-inline-block align-top" alt="treasure">' + '<br>' + '<br>' + '<h6 class="card-subtitle mb-2 text-muted"> Profile</h6>' + '<p class="card-text">Points: ' + "<span id='cardPoints'>" + currentXP + "</span>" + '</p>' + '<a href="profile.html" class="card-link">Go to my profile</a>' + '</div>' + '</div>'
    });

    navigator.geolocation.watchPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      profileMarker.setPosition(pos);

      for (let i = 0; i < quests.length; i++) {
        let distance = getDistance(pos, quests[i]);
        console.log(distance);
        console.log(points[i]);
        if(distance < 75 && quests.length === 3) {
          console.log('ive been triggered');
           addExperience(points[i]);
           goalUp = false;
           quests = [];
           window.location = 'profile.html';
        }
      }
      // var profileMarker = new google.maps.Marker({
      //   position: pos,
      //   map: map,
      // });
      map.setCenter(pos);

      //Adds on click function to the user's location marker
      google.maps.event.addListener(profileMarker, 'click', function () {
        $('#cardPoints').text(currentXP);
        infoWindow.open(map, profileMarker);
        infoWindow.setPosition(pos);
        // infoWindow.setContent('You are here!');
        // infoWindow.open(map);
      });






      function setGoals() {
        goalUp = true;
        //Defines radius for goal
        var request = {
          location: pos,
          radius: '1000', // meters.
          types: ['restaurant']
        };

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, function (placeArray) {

          //For loop to grab place from array, changing var for 'const' to make cards appear in every location 

          for (let i = 0; i < 3; i++) {
            const index = Math.floor(Math.random() * placeArray.length);
            // Remove the element of the array on the index provided.
            const place = placeArray.splice(index, 1)[0];


            // Adding goal marker
            const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map: map,
              title: place.name,
              label: place.name,
              icon: image,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });

            quests.push({
              lat: marker.lat,
              lng: marker.lng
            });

            const contentString = '<div id="treasureCard" class="card" style="width: 10rem;">' + ' <div class="card-body text-center">' + '<img src="assets/images/ghost.png" width="30" height="30" class="d-inline-block align-top" alt="treasure">' + '<br>' + '<br>' + '<h6 class="card-subtitle mb-2 text-muted"> Catch the ghost now!</h6>' + '<p class="card-text">'+points[i]+' points'+'</p>' + '</div>' + '</div>';

            const infoWindowFlag = new google.maps.InfoWindow({
              content: contentString
            });

            google.maps.event.addListener(marker, 'click', function () {
              $('#cardPoints').text(currentXP);
              infoWindowFlag.open(map, marker);
            

            });
          }
        });
      };

      if (!goalUp) {
        setGoals();
      }



    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
},1000)

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


