/**
 * @jsx React.DOM
 */
var React = require('react');

// markers
var iconA = 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/'+
  'spotlight-waypoint-a.png&text=A&psize=16&font=fonts/'+
  'Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1';
var iconB = 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/'+
  'spotlight-waypoint-b.png&text=B&psize=16&font=fonts/'+
  'Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1';

var GMap  = React.createClass({
  // set some default values
  getDefaultProps: function() {
    return {
      latitude          : null,
      longitude         : null,
      default_latitude  : 50,
      default_longitude : 6,
      zoom              : 4,
      origin            : null,
      dest              : null,
      dirDisplay        : null,
      dirPanel          : null,
      defaultRoute      : null,
      callback          : null,
      strokeColor       : "Navy",
      strokeOpacity     : 0.7
    };
  },

  // initialize local variables
  getInitialState: function() {
    return {
      dirService : null,
      map        : null,
      marker     : null,
      dirDisplay : null
    };
  },

  componentDidMount : function() {
    var mapOpts = {
      zoom      : this.props.zoom,
      center    : new google.maps.LatLng(this.props.default_latitude,
                                         this.props.default_longitude),
      mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    var displayOpts = {
      draggable       : true,
      polylineOptions : {
        strokeColor   : this.props.strokeColor,
        strokeOpacity : this.props.strokeOpacity
      }
    };
    var homeMarker = new google.maps.Marker({
      position : new google.maps.LatLng(this.props.latitude, 
                                        this.props.longitude),
      title    : 'my location!'
    });

    this.setState({
      dirService      : new google.maps.DirectionsService(),
      map             : new google.maps.Map(this.getDOMNode(), mapOpts),
      marker          : homeMarker,
      dirDisplay      : new google.maps.DirectionsRenderer(displayOpts),
      markerA         : new google.maps.Marker({
        icon            : iconA,
        position        : null,
        labelContent    : "A",
      }),
      markerB         : new google.maps.Marker({
        icon          : iconB,
        position      : null
      }),
      polyline        : new google.maps.Polyline({
        path          : [],
        strokeWeight  : 3,
        strokeColor   : this.props.strokeColor,
        strokeOpacity : this.props.strokeOpacity
      })
    });
    google.maps.event.addListener(this.state.dirDisplay, 
                                  'directions_changed', function() {
      console.log("directions changed");
      this.handleRouteChange(this.state.dirDisplay.getDirections());
    }.bind(this));
  },

  // update markers if needed
  componentDidUpdate: function() {
    console.log("UPDATE");
    if (this.props.latitude && this.props.longitude) this.markUpdate();

    if (this.props.origin && this.props.dest) this.routeUpdate();
    else {
      if (this.props.defaultRoute) this.defaultRouteUpdate();
    }
  },

  shouldComponentUpdate: function(newProps) {
    console.log("new Props");
    console.log(newProps.origin);
    console.log(newProps.dest);
    console.log("old Props");
    console.log(this.props.origin);
    console.log(this.props.dest);
    // TODO: looks terrible
    if (this.props.defaultRoute) return true;
    if (this.props.origin && this.props.dest && 
        newProps.origin && newProps.des && 
        this.props.origin === newProps.origin &&
                              this.props.dest === newProps.dest) {
      console.log("YEAHH!");
      return false;
    } else return true;
  },

  defaultRouteUpdate: function() {
    this.state.polyline.setMap(null);
    this.state.markerA.setMap(null);
    this.state.markerB.setMap(null);

    var bounds = new google.maps.LatLngBounds();
    var path = [];
    this.props.defaultRoute.forEach(function(point) {
      path.push(new google.maps.LatLng(point.k, point.B));
      bounds.extend(new google.maps.LatLng(point.k, point.B));
    });
    // modal bug fix
    google.maps.event.trigger(this.state.map, 'resize');
    this.state.polyline.setPath(path);
    this.state.polyline.setMap(this.state.map);
    this.state.map.fitBounds(bounds);

    path = this.state.polyline.getPath();
    var posB = path.j[path.j.length-1];
    var BmarkerPos = new google.maps.LatLng(posB.k, posB.B);
    var AmarkerPos = new google.maps.LatLng(path.j[0].k, path.j[0].B);

    this.state.markerA.position = AmarkerPos;
    this.state.markerA.setMap(this.state.map);

    this.state.markerB.position = BmarkerPos;
    this.state.markerB.setMap(this.state.map);
  },

  markUpdate: function() {
    console.log("Marker");
    var pos = new google.maps.LatLng(this.props.latitude, 
                                     this.props.longitude);
    this.state.marker.position = pos;
    this.state.marker.setMap(this.state.map);
    this.state.map.setCenter(pos);
    this.state.map.setZoom(8);
  },

  handleRouteChange: function(res) {
    console.log("handleChange");
    this.props.callback(res);
  },

  routeUpdate: function() {
    var pos;
    if (this.props.origin.match(/\((-?[0-9\.]+), (-?[0-9\.]+)\)/)){
      var coords  = this.props.origin.replace(/[\(\)]/g,'').split(', ');
      pos = new google.maps.LatLng(coords[1], coords[0]);
    } else pos = this.props.origin;

    var request = {
      origin      : pos,
      destination : this.props.dest,
      travelMode  : google.maps.TravelMode.BICYCLING
    };

    this.state.dirService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        this.state.dirDisplay.setDirections(response);
        this.state.dirDisplay.setMap(this.state.map);
        //TODO put to props
        this.state.dirDisplay.setPanel(document
                                       .getElementById('dir-panel'));
      this.state.marker.setMap(null);
      document.getElementById("dir-panel").className = "dir-panel";
      }
    }.bind(this));
  },

  render : function() {
    return (
      <div className="embed-responsive embed-responsive-16by9" >
      </div>
    );
  },
});

module.exports = GMap;
