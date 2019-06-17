
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.


var map, infoWindow;

function initMap() {

  map = new google.maps.Map(document.getElementById('mapContainer'), {
    center: { lat: 47.6191119, lng: -122.31940750000001 },
    zoom: 14
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };


//Defines radius for goal
      var request = {
        location: pos,
        radius: '1000', // meters.
        types: ['restaurants']
      };
    
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function(placeArray) {

        for (let index = 0; index < placeArray.length && index < 5; index++) {
          const place = placeArray[index];

          //Adding maker for goal
          var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
          var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
            label: place.name,
            icon: image
          });
  
          marker.setMap(map);
            
        }

      });


      // Adding image instead of marker
      // var image = 'http://freepngimg.com/thumb/treasure/14-2-treasure-png-picture.png';
      // var beachMarker = new google.maps.Marker({
      //   position: pos,
      //   map: map,
      //   icon: image
      // });
      // var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
      // var beachMarker = new google.maps.Marker({
      //   position: pos,
      //   map: map,
      //   icon: image
      // });

      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here!');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}




