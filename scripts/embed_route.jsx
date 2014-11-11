/**
 * @jsx React.DOM
 */
var React = require('react');
var mountNode = document.getElementById("react-main-mount");
var google_maps_api_key = "AIzaSyBdU5jAnqlZLJt0j75X9dOwHAJ9AavGWs8";
var source = "https://www.google.com/maps/embed/v1/directions?key="+
google_maps_api_key+"&mode=bicycling&origin=Oslo+Norway"+
  "&destination=Telemark+Norway&avoid=tolls|highways";

var MapRoute = React.createClass({
  render: function() {
    var iframeStyles = {
            border: 0
    };

    return(
    <div className="col-lg-6">
      <div className="embed-responsive embed-responsive-16by9">
         <iframe
          width="600"
          height="450"
          frameborder="0" style={iframeStyles}
        src={source}>
          </iframe> 
      </div>
    </div>
    );
  }
});

React.render(<MapRoute name="John" />, mountNode);
