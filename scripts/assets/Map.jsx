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
      homeMarker     : null,
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
    var markerA = new google.maps.Marker({
      icon         : iconA,
      position     : null,
      labelContent : "A",
    });
    var markerB = new google.maps.Marker({
      icon     : iconB,
      position : null
    });
    var polyline = new google.maps.Polyline({
      path          : [],
      strokeWeight  : 3,
      strokeColor   : this.props.strokeColor,
      strokeOpacity : this.props.strokeOpacity
    });

    this.setState({
      dirService      : new google.maps.DirectionsService(),
      map             : new google.maps.Map(this.getDOMNode(), mapOpts),
      homeMarker      : homeMarker,
      dirDisplay      : new google.maps.DirectionsRenderer(displayOpts),
      markerA         : markerA,
      markerB         : markerB,
      polyline        : polyline
    });

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(this.state.map);

    google.maps.event.addListener(this.state.dirDisplay,
                                  'directions_changed', function() {
      this.handleRouteChange(this.state.dirDisplay.getDirections());
      google.maps.event.trigger(this.state.map, 'resize');
    }.bind(this));
  },

  // update markers if needed
  componentDidUpdate: function() {

    if (this.props.origin && this.props.dest){
      this.routeUpdate();
      //if (this.props.latitude && this.props.longitude) this.markUpdate();
    }
    else {
      if (this.props.defaultRoute &&
        this.state.dirDisplay.getDirections() === undefined){
          this.defaultRouteUpdate();
      }
    }
    google.maps.event.trigger(this.state.map, 'resize');
    //this.state.map.setCenter(this.state.markerA.position);
  },

  shouldComponentUpdate: function(newProps) {
    // TODO: looks terrible
    /*
     * if (this.props.defaultRoute) return true;
     * if (this.props.origin && this.props.dest &&
     *     newProps.origin && newProps.des &&
     *       this.props.origin === newProps.origin &&
     *                             this.props.dest === newProps.dest) {
     *   return false;
     * } else return true;
     */
    return true;
  },

  defaultRouteUpdate: function() {
    this.state.polyline.setMap(null);
    this.state.markerA.setMap(null);
    this.state.markerB.setMap(null);
    //this.state.homeMarker.setMap(null);

    var bounds = new google.maps.LatLngBounds();
    var path = [];
    this.props.defaultRoute.forEach(function(point) {
      path.push(new google.maps.LatLng(point.k, point.D));
      bounds.extend(new google.maps.LatLng(point.k, point.D));
    });
    // modal bug fix
    google.maps.event.trigger(this.state.map, 'resize');

    this.state.polyline.setPath(path);
    this.state.polyline.setMap(this.state.map);
    this.state.map.fitBounds(bounds);

    path = this.state.polyline.getPath();
    var posB = path.j[path.j.length-1];
    var BmarkerPos = new google.maps.LatLng(posB.k, posB.D);
    var AmarkerPos = new google.maps.LatLng(path.j[0].k, path.j[0].D);

    this.state.markerA.position = AmarkerPos;
    this.state.markerA.setMap(this.state.map);

    this.state.markerB.position = BmarkerPos;
    this.state.markerB.setMap(this.state.map);
    //console.log("MarkerA", AmarkerPos, path.j[0].D);
    //console.log("MarkerB", BmarkerPos, posB);
  },

  markUpdate: function() {
    var pos = new google.maps.LatLng(this.props.latitude,
                                     this.props.longitude);
    this.state.homeMarker.position = pos;
    this.state.homeMarker.setMap(this.state.map);
    this.state.map.setCenter(pos);
    this.state.map.setZoom(8);
  },

  handleRouteChange: function(res) {
    if (this.props.callback) this.props.callback(res);
  },

  routeUpdate: function() {
    if (this.state.markerA && this.state.markerB && this.state.polyline){
      this.state.polyline.setMap(null);
      this.state.markerA.setMap(null);
      this.state.markerB.setMap(null);
    }
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
      this.state.homeMarker.setMap(null);
      if (document.getElementById("dir-panel"))
        document.getElementById("dir-panel").className = "dir-panel";
      }
    }.bind(this));
  },

  render : function() {
    return (
      <div className="map-canvas" >
      </div>
    );
  },
});

module.exports = GMap;
