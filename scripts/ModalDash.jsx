/**
 * @jsx React.DOM
 * @flow
 */
var React          = require('react');
var GMap           = require('./assets/Map');
var CommentBox     = require('./assets/CommentBox');
var Form           = require('./assets/Form');

var superagent     = require('superagent');

var ModalDash = React.createClass({

  getDefaultProps: function() {
    return({
      data: {},
      user: null,
      dataChangeHandler: null
    });
  },

  getInitialState: function() {
    return {
      error: null,
      open: false,
      origin: null,
      dest: null,
      latitude: null,
      longitude: null
    };
  },

  componentDidMount: function() {
    $(this.getDOMNode()).modal({background: true, keyboard: true, 
                               show: false});
    $("#modal").on('hidden.bs.modal', function () {
      this.setState({error: null, open: false});
    }.bind(this));

    $("#modal").on('shown.bs.modal', function () {
      this.setState({open: true});
    }.bind(this));
  },

  componentWillUnmount: function() {
    $(this.getDOMNode()).off('hidden');
  },

  // This was the key fix --- stop events from bubbling
  handleClick: function(e) {
      e.stopPropagation();
  },

  register: function() {
    superagent.put('/tours/register')
    .send(this.props.data)
    .end(function(error, res){
      if (!error) {
        if (res === "success"){
          this.setState({error: false});
        }
        else {
          this.setState({error: true});
        }
      }
    }.bind(this));
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var options; 

    superagent.put('/tours/change/'+this.props.data._id)
    .send(this.state)
    .end(function(error, res){
      if (!error) {
        options = {position: "right", className: "success"};
        $("#submit-button").notify("Tour changed!", options);
        this.props.dataChangeHandler(this.state);
      }
      else {
        options = {position: "right", className: "error"};
        $("#submit-button").notify("BoOM! An error has occured!", 
                                   options);
      } 
    }.bind(this));
  },

  onClose: function() {
  },

  componentDidUpdate: function() {
    console.log(this.props);
  },

  getOriginDest: function(origin, dest) {
    console.log("call callback");
    console.log("origin", origin, "dest", dest);
    this.setState({
      origin: origin,
      dest: dest
    });
  },

  handleRouteChange: function() {
    console.log("ROUTE CHANGE");
  },

  render: function() {
    console.log("Props Data Route", this.props.data.route);
    console.log("State", this.state.origin, this.state.dest);
    console.log("latitude", this.state.latitude,
                "longitude", this.state.longitude);

    return (
      <div id="modal" onClick={this.handleClick} 
        className="modal" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-large">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" 
                data-dismiss="modal" aria-hidden="true"
                onClick={this.onClose}>×</button>
              <h4 className="modal-title">
                Tour: {this.props.data.name}
              </h4>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-4 sidebar">
                  <Form data={this.props.data} 
                    getOriginDest={this.getOriginDest}
                    dataChangeHandler={this.props.dataChangeHandler}
                    handleSubmit={this.handleSubmit}
                  />
                </div>
                <div className="col-md-8">
                  <GMap 
                    defaultRoute={this.props.data.route}
                    origin={this.state.origin}
                    dest={this.state.dest}
                    callback={this.handleRouteChange}
                    longitude={this.state.longitude}
                    latitude={this.state.latitude} 
                  />
                </div>
                <div className="col-md-8">
                  <CommentBox tourId={this.props.data._id} 
                    url="/tours/comments" pollInterval={2000} 
                    active={this.state.open}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" 
                data-dismiss="modal" onClick={this.onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ModalDash;
