/**
 * @jsx React.DOM
 * @flow
 */
var React          = require('react');
var GMap           = require('./assets/Map');
var CommentBox     = require('./assets/CommentBox');

var superagent     = require('superagent');

var ModalDash = React.createClass({
  mixins: [React.addons.LinkedStateMixin,
           require('./assets/DashChangeFormMixin')
          ],

  Route: null,

  getDefaultProps: function() {
    return({
      data: {},
      user: null,
      dataChangeHandler: null,
      route: null,
      id : null
    });
  },

  getInitialState: function() {
    return {
      error: null,
      open: false,
      changeBtnActive: true,
      deleteBtnActive: true,
    };
  },

  componentDidMount: function() {
    $(this.getDOMNode()).modal({background: true, keyboard: true,
                               show: false});
    var modalSel = "#"+this.props.id;
    console.log("modalDash Props", this.props);
    console.log("modal selector", modalSel);
    $(modalSel).on('hidden.bs.modal', function () {
      this.setState({error: null, open: false});
    }.bind(this));

    $(modalSel).on('shown.bs.modal', function () {
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

  shouldComponentUpdate: function(nextProps, nextState) {

    // console.log("this props", this.props, "next props", nextProps);
    // if (this.state.origin === null) return true;
    // else return (this.state.origin !== nextState.origin ||
    //         this.state.dest !== nextState.dest);
    return true;
  },

  handleRouteChange: function(route) {
    this.setState({route: route.routes[0].overview_path,
                  origin: null, dest: null});
  },

  handleChange: function(e) {
    e.preventDefault();
    console.log("handle change", e);
    var options;
    superagent.put('/tours/change/'+this.props.data._id)
    .send(this.getUpdatedData())
    .end(function(error, res) {
      options = {
        position: "left",
        gap: 20,
        className: "success",
        autoHide: false,
        arrowShow: false,
      };
      if (!error) {
        $("#delete-button").notify("Tour changed!", options);
        this.props.dataChangeHandler(this.getUpdatedData());
        //this.setState({route: null});
      }
      else {
        options.className = "error";
        $("#delete-button").notify("BoOM! An error has occured!",
                                   options);
        console.log(error);
      }
    }.bind(this));
  },

  handleDelete: function(e) {
    e.preventDefault();
    console.log("handle Delete", e);
    var options;
    superagent.del('/tours/delete/'+this.props.data._id)
    .send(this.getUpdatedData())
    .end(function(error, res) {
      if (!error) {
        options = {
          position: "left",
          gap: 20,
          className: "warn",
          autoHide: false,
          arrowShow: false,
        };
        $("#delete-button").notify("Tour deleted!", options);
        this.props.dataDeleteHandler(this.getUpdatedData());
        this.setState({changeBtnActive: false});
      }
      else {
        options = {position: "right", className: "error"};
        $("#delete-button").notify("BoOM! An error has occured!",
                                   options);
        console.log(error);
      }
    }.bind(this));
  },

  render: function() {
    var changeBtnClass = "btn btn-warning";
    var deleteBtnClass = "btn btn-primary";
    if (!this.state.changeBtnActive) {
      changeBtnClass = changeBtnClass+" disabled";
      deleteBtnClass = deleteBtnClass+" disabled";
    }

    return (
      <div id={this.props.id} onClick={this.handleClick}
        className="modal" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg">
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
                  {this.form()}
                </div>
                <div className="col-md-8">
                  <GMap
                    defaultRoute={this.state.route}
                    origin={this.state.origin}
                    dest={this.state.dest}
                    callback={this.handleRouteChange}
                    longitude={this.state.longitude}
                    latitude={this.state.latitude}
                  />
                </div>
                <div className="col-md-8">
                  <CommentBox tourId={this.props.data._id}
                    url="/tours/comments"
                    active={this.state.open}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="btn-group-inline">
                <div className="btn-inline">
                  <button id="delete-button" type="submit"
                    className={deleteBtnClass}
                    onClick={this.handleDelete}>
                    Delete
                  </button>
                </div>
                <div className="btn-inline">
                  <button id="submit-button" type="submit"
                    className={changeBtnClass}
                    onClick={this.handleChange}>
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ModalDash;
