/**
 * @jsx React.DOM
 */
var React = require('react');

var GMap = React.createClass({

  // set some default values
  getDefaultProps: function() {
    return {
      latitude: 0,
      longitude: 0,
      zoom: 4,
      width: 500,
      height: 500,
      points: [],
      gmaps_api_key: '',
      gmaps_sensor: false,
      origin: "",
      dest: "",
      dirDisplay: null
    };
  },
  
  // initialize local variables
  getInitialState: function() {
    return {
      map : null,
      markers : []
    };
  },

  mapUpdate : function() {
    this.routeUpdate();
  },

  componentDidMount : function() {
      var mapOptions = {
        zoom: this.props.zoom,
        center: new google.maps.LatLng(this.props.latitude, 
                                       this.props.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.setState({
        DirService: new google.maps.DirectionsService(),
        Map: new google.maps.Map(this.getDOMNode(), mapOptions)
        //dirDisplay: new google.maps.DirectionsRenderer({draggable:true})
      });
      google.maps.event.addListener(this.props.dirDisplay, 
                                    'directions_changed', function() {
      }.bind(this));
      this.mapUpdate();
  },

  // update markers if needed
  componentDidUpdate: function() {
    //this.mapUpdate(this.getDOMNode(), nextProps.origin, 
    //               nextProps.dest);
    this.mapUpdate();
  },

  routeUpdate: function() {
    var request = {
      origin: this.props.origin,
      destination: this.props.dest,
      travelMode: google.maps.TravelMode.BICYCLING
    };

    this.state.DirService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        this.props.dirDisplay.setDirections(response);
        this.props.dirDisplay.setMap(this.state.Map);
        this.props.dirDisplay.setPanel(document
                                       .getElementById('dir-panel'));
      }
    }.bind(this));
    },
    render : function() {

      var style = {
        width: this.props.width,
        height: this.props.height
      };

      return (
        <div className="embed-responsive 
          embed-responsive-16by9" >
        </div>
      );
    },
  });

module.exports = GMap;

