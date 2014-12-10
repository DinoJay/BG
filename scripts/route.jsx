/**
 * @jsx React.DOM
 */
/* @flow */
var React               = require('react');
var superagent          = require('superagent');

var GMap                = require('./assets/Map');
var loadScript          = require('./assets/loadScript');

var mountNode           = document.getElementById('react-main-mount');

var MapRouter = React.createClass({

  mixins: [require('./assets/locMixin')],

  Route : null,

  getInitialState: function(){
    return {
      origin            : "",
      destination       : "",
      latitude          : null,
      longitude         : null,
      route        : null,
      db_tour_save_msg : "",
    };
  },

  getDefaultProps: function(){
    return({
      gmaps_api_key : '',
      gmaps_sensor  : false
    });
  },

  componentDidMount: function() {
    var origin_compl= new google.maps
                            .places
                            .Autocomplete(this.refs.origin.getDOMNode());
    var dest_compl = new google.maps
                              .places
                              .Autocomplete(this.refs.dest.getDOMNode());
    google.maps.event.addListener(dest_compl, 'place_changed', 
                                  function() {
                                    console.log("TRIGGER");
                                    this.handleRouteChange();
                                  }.bind(this)
                                 );
    google.maps.event.addListener(origin_compl, 'place_changed', 
                                  function() {
                                    this.handleRouteChange();
                                  }.bind(this)
                                 );
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var origin = this.refs.origin.getDOMNode().value ;
    var destination = this.refs.dest.getDOMNode().value ;
    console.log("route");
    console.log(this.state.route);

    if (!this.state.saved_event){
      superagent.put('/route/create')
      .send({
        name       : this.refs.name.getDOMNode().value,
        origin     : this.refs.origin.getDOMNode().value,
        dest       : this.refs.dest.getDOMNode().value,
        start_date : this.refs.start_date.getDOMNode().value,
        end_date   : this.refs.end_date.getDOMNode().value,
        pers       : this.refs.pers.getDOMNode().value,
        difficulty : this.refs.difficulty.getDOMNode().value,
        descr      : this.refs.descr.getDOMNode().value,
        route      : this.Route.routes[0].overview_path
      })
      .end(function(error, res){
        if (error) console.log(error);
        console.log("Save in DB");
        console.log("RESPONSE", res);
        this.setState({db_tour_save_msg: "success"});
      }.bind(this));
    } 
    else {
      this.setState({db_tour_save_msg: "fail"});
    }
  },

  handleRouteChange: function(e) {
    //e.preventDefault();
    var origin      = this.refs.origin.getDOMNode().value;
    var destination = this.refs.dest.getDOMNode().value;
    console.log(origin);
    this.setState({db_tour_save_msg : "",
                  origin             : origin,
                  destination        : destination,
                  });
  },

  getDirDisplay : function(route) {
    //this.setState({ route: route });
    this.Route = route;
  },

  render: function() {
    var notifier;
    if (this.state.db_tour_save_msg == 'success') {
      notifier = (
        <div className="form-group alert alert-success" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign"
            aria-hidden="true" 
          />
          <span className="sr-only">Error:</span>
            {this.state.db_tour_save_msg}
        </div>
      );
    } else {
      if (this.state.db_tour_save_msg !== "") {
        notifier = (
          <div className="form-group alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign"
              aria-hidden="true"
            />
            <span className="sr-only">Error:</span>
              {this.state.db_tour_save_msg}
          </div>
        );
      } else notifier = "";
    }
    return(
      <div className="row">
        <div className="header-off" />
        <h1>Create your own Tour and share it!</h1>
        <p className="lead">
          Choose your date, select a route and wait TODO
        </p>
        <div className="col-md-4 sidebar">
          <form onSubmit={this.handleSubmit} 
            className="bs-example bs-example-form">
              <div className="form-group">
                <label>Event Name</label>
                <input ref="name" type="text" 
                  className="form-control" 
                  placeholder="Name of your Biking Event"
                />
              </div>
              <div className="form-group">
                <label>Origin </label>
                <div className="input-group">
                  <input ref="origin" type="text" 
                    className="form-control" 
                  />      
                  <span className="input-group-btn">
                    <button className="btn btn-default"
                      onClick={this.handleLoc}>
                      <span className="glyphicon glyphicon-home"/>
                    </button>
                  </span>
                </div>     
              </div>     
              <div className="form-group">
                <label>Dest</label>
                <input ref="dest" type="text" 
                  className="form-control" />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input ref="start_date" type="date"
                  className="form-control"
                  placeholder="Start Date of your Bike Tour"
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input ref="end_date" type="date"
                  className="form-control"
                  placeholder="End Date of your Bike Tour"
                />
              </div>
              <div className="form-group">
                <label>Persons</label>
                <input ref="pers" type="number"
                  className="form-control"
                  placeholder="limit of persons who can join you"
                />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <input ref="difficulty" type="number"
                  className="form-control"
                  placeholder="Denote here the level of Difficulty"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea ref="descr" type="text" 
                  className="form-control" 
                  placeholder="Add a description to your event"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-default">
                  Submit
                </button>
              </div>
              <div className="form-group">
                {notifier}
              </div>
            </form>
        </div>
          <div className="col-md-8">
            <GMap className="google-map" 
               origin={this.state.origin}
               dest={this.state.destination} 
               longitude={this.state.longitude}
               latitude={this.state.latitude}
               callback={this.getDirDisplay}
             />
            <div className="col-md-12">
              <div id="dir-panel"/>
            </div>
        </div>
      </div>
    );
  }
});

// load google map service with callback
loadScript("mapLoaded");
window.mapLoaded = (function() {
  React.render(<MapRouter />, mountNode);
});
