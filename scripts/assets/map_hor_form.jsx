/**
 * @jsx React.DOM
 */
var React = require('react');
var mountNode = document.getElementById("react-main-mount");
var google_maps_api_key = "AIzaSyBdU5jAnqlZLJt0j75X9dOwHAJ9AavGWs8";
var GMap = require('./assets/map');

require('bootstrap/js/tooltip');
require('bootstrap/dist/js/bootstrap');

var MapRouter = React.createClass({

  getInitialState: function(){
    return {
      origin: "Brussels",
      destination: "Ravenswiede"
    };
  },
  getDefaultProps: function(){
    return({
      gmaps_api_key: '',
      gmaps_sensor: false 
    });
  },

  componentDidMount: function() {
    new google.maps.places.Autocomplete(this.refs.origin.getDOMNode());
    new google.maps.places.Autocomplete(this.refs.dest.getDOMNode());
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var origin = this.refs.origin.getDOMNode().value ;
    var destination = this.refs.dest.getDOMNode().value ;
    console.log("Submit");
    console.log(origin);
    this.setState({origin: origin, destination: destination});
  },

  render: function() {

    return(
      <div className="row">
        <div className="header-off" />
          <div className="col-md-2 sidebar">
            <form onSubmit={this.handleSubmit} 
              className="bs-example bs-example-form">
                <div className="form-group">
                  <label>Origin </label>
                  <div className="input-group">
                    <input ref="origin" type="text" 
                      className="form-control" defaultValue="Brussels"/>
                    <span className="input-group-addon">
                      <input type="radio" className="btn btn-default" 
                        data-toggle="tooltip" data-placement="left" 
                        title="Tooltip on left" />
                    </span>
                  </div>
                  </div>     
                <div className="form-group">
                  <label>Dest</label>
                  <input ref="dest" type="text" 
                     className="form-control" defaultValue="Ravenswiede"
                  />      
                </div>     
                <div className="form-group">
                  <button type="submit" className="btn btn-default">
                 <span class="glyphicon glyphicon-zoom-in"></span> 
                    Submit
                  </button>
                </div>     
              </form>
          </div>
            <div className="col-md-6">
               <GMap className="google-map" origin={this.state.origin} 
                 dest={this.state.destination} />
          </div>
          <div className="row">
            <div className="col-md-offset-2 col-md-6">
            <div id="dir-panel"/>
            </div>
          </div>
        </div>
    );
  }
});

window.mapLoaded = (function() { 
  React.render(<MapRouter />, mountNode);
})
