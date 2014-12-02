var LocMixin = {
  handleLoc: function(e){
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      var lat_long_str = '('+longitude.toString()+ 
                         ', '+ latitude.toString() +')';
      this.refs.origin.getDOMNode().value = lat_long_str;
      this.setState({latitude : latitude,
                    longitude : longitude,
                    });
    }.bind(this));
  }
};

module.exports = LocMixin;
