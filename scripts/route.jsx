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

  mixins: [require('./assets/changeFormMixin')],

  Route : null,

  getInitialState: function(){
    return {
      route        : null,
      db_tour_save_msg : "",
    };
  },

  getDefaultProps: function(){
    return({
      data: {
        origin : null,
        dest : null,
        descr : null,
        difficulty : null,
        end_date : null,
        name : null,
        pers : null,
        start_date : null,
      },
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
          {this.form()}
          <div className="form-group">
            <button onClick={this.handleSubmit} type="submit"
              className="btn btn-default">
              Submit
            </button>
          </div>
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
