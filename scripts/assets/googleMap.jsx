/** @jsx React.DOM */              

var $ = require('jquery');
var googleMap = {};

googleMap.create = function(el) { 
  var directionsDisplay = new google.maps.DirectionsRenderer();

  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom:7,
    center: chicago
  };
  //TODO: props to include as arg
  //this.update(el, state, callback, stop_load_screen);

  var map = new google.maps.Map(document.body, 
                                mapOptions);
  directionsDisplay.setMap(map);
};

googleMap.update = function(el, start, end){
  //var start = document.getElementById('start').value;
  //var end = document.getElementById('end').value;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
  

};


module.exports = googleMap;
