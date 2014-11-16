/**
 * @jsx React.DOM
 */
var React = require('react');
var mountNode = document.getElementById("react-main-mount");
var google_maps_api_key = "AIzaSyBdU5jAnqlZLJt0j75X9dOwHAJ9AavGWs8";
var GMap = require('./assets/map');
var superagent = require('superagent');

require('bootstrap/js/tooltip');
require('bootstrap/dist/js/bootstrap');

var MapRouter = React.createClass({

  getInitialState: function(){
    return {
      origin: "Brussels",
      destination: "Ravenswiede",
      dirDisplay: this.props.dirDisplay,
      db_event_save_msg: "",
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
    if (!this.state.saved_event){
      superagent.put('/route/')
        .send({route: this.state.dirDisplay.getDirections(),
               "pet":"tobi"})
              .end(function(error, res){
              console.log("Save in DB");
              console.log(res);
              this.setState({db_event_save_msg: "success"});
            }.bind(this));
    } else {
      this.setState({db_event_save_msg: "fail"});
    }
  },

  handleClick: function(e) {
    e.preventDefault();
    var origin = this.refs.origin.getDOMNode().value ;
    var destination = this.refs.dest.getDOMNode().value ;
    console.log("Submit");
    console.log(origin);
    this.setState({db_event_save_msg: "", origin: origin, 
                  destination: destination});
  },

  render: function() {
    console.log(this.state.saved_event);
    var notifier;
    if (this.state.db_event_save_msg == 'success') {
      notifier = <div className="alert alert-success" role="alert">
  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
  <span className="sr-only">Error:</span>
    {this.state.db_event_save_msg}
  </div>
    } else {
      if (this.state.db_event_save_msg != "") {
      notifier = <div className="alert alert-danger" role="alert">
  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
  <span className="sr-only">Error:</span>
    {this.state.db_event_save_msg}
  </div>
      } else notifier = "";
    }

    return(
      <div className="row">
        <div className="header-off" />
          <div className="col-md-4 sidebar">
            <form onSubmit={this.handleSubmit} 
              className="bs-example bs-example-form">
                <div className="form-group">
                  <label>Origin </label>
                  <input ref="origin" type="text" 
                     className="form-control" defaultValue="Ravenswiede"
                  />      
                </div>     
                <div className="form-group">
                  <label>Dest</label>
                  <div className="input-group">
                    <input ref="dest" type="text" 
                      className="form-control" defaultValue="Brussels"/>
                    <span className="input-group-btn">
                      <button className="btn btn-default"
                        onClick={this.handleClick}>
                        Search Route  
                        <span className="glyphicon glyphicon-zoom-in"/>
                      </button>
                    </span>
                  </div>
                </div>     
                <div className="form-group">
                </div>     
                <div className="form-group">
                  <label>Persons</label>
                  <input ref="pers" type="text" 
                    className="form-control" 
                    defaultValue=""
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea ref="descr" type="text" 
                    className="form-control" 
                    defaultValue="Add a description to your event"
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-default">
                    Submit
                  </button>
                  {notifier}
                </div>     
              </form>
          </div>
            <div className="col-md-8">
               <GMap className="google-map" origin={this.state.origin} 
                 dest={this.state.destination} mode={this.state.mode}
                dirDisplay={this.state.dirDisplay}/>
          </div>
          <div className="row">
            <div className="col-md-offset-4 col-md-8">
            <div id="dir-panel"/>
            </div>
          </div>
        </div>
    );
  }
});

window.mapLoaded = (function() { 
  var dirDisplay = new google.maps.DirectionsRenderer({draggable:true})
  React.render(<MapRouter dirDisplay={dirDisplay}/>, mountNode);
})
