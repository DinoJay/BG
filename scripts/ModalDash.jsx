/**
 * @jsx React.DOM
 * @flow
 */
var React          = require('react');
var GMap           = require('./assets/Map');
var CommentBox     = require('./assets/CommentBox');
var UserTable     = require('./assets/UserTable');

var superagent     = require('superagent');

var ModalDash = React.createClass({
  mixins: [ require('./assets/dashChangeFormMixin') ],

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
      open: false,
      deleted: false,
      changed        : false
    };
  },

  componentDidMount: function() {
    $(this.getDOMNode()).modal({background: true, keyboard: true,
                               show: false});
    var modalSel = "#"+this.props.id;
    console.log("modalDash Props", this.props);
    console.log("modal selector", modalSel);

    $(modalSel).on('shown.bs.modal', function () {
      this.setState({open: true});
    }.bind(this));

    $(modalSel).on('hidden.bs.modal', function () {
      if (!this.state.deleted) {
        this.handleChange();
        this.props.dataChangeHandler(this.getUpdatedData());
      }
      this.setState({open: false, deleted: false});
    }.bind(this));
  },

  componentWillUnmount: function() {
    $(this.getDOMNode()).off('hidden');
  },

  // This was the key fix --- stop events from bubbling
  handleClick: function(e) {
    e.stopPropagation();
  },

  componentDidUpdate: function(nextProps, nextState) {
    if (nextProps.data.route !== null &&
        nextProps.data.route !== this.props.data.route)
      this.setState({route: this.props.data.route});
  },

  handleRouteChange: function(route) {
    console.log("handleRouteChange");
    this.setState({route: route.routes[0].overview_path,
                  origin: null, dest: null});
    console.log("This Route", this.state.route);
  },

  componentWillReceiveProps: function(newProps) {

    var origin = newProps.data.origin;
    var dest = newProps.data.dest;
    var descr = newProps.data.descr;
    var difficulty = newProps.data.difficulty;
    var end_date = newProps.data.end_date;
    var name = newProps.data.name;
    var pers = newProps.data.pers;
    var start_date = newProps.data.start_date;

    this.refs.origin.getDOMNode().value = origin;
    this.refs.dest.getDOMNode().value = dest;
    this.refs.descr.getDOMNode().value = descr;
    this.refs.difficulty.getDOMNode().value = difficulty;
    this.refs.end_date.getDOMNode().value = end_date;
    this.refs.name.getDOMNode().value = name;
    this.refs.pers.getDOMNode().value = pers;
    this.refs.start_date.getDOMNode().value = start_date;
  },

  handleChange: function() {
    var options;
    var that = this;
    superagent.put('/tours/change/'+this.props.data._id)
    .send(this.getUpdatedData())
    .end(function(error, res) {
      options = {
        position: "left",
        gap: 20,
        className: "success",
        arrowShow: false,
      };
      if (!error) {
        $("#delete-button").notify("Tour changed!", options);
        console.log("STATE", this.state);
        console.log("handleChange", this.getUpdatedData());
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
        var modalSel = "#"+this.props.id;
        this.props.dataDeleteHandler(this.getUpdatedData());
        this.setState({deleted: true});

        $(modalSel).modal('toggle');
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
    var deleteBtnClass = "btn btn-danger";

    return (
      <div id={this.props.id} onClick={this.handleClick}
        className="modal" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close"
                data-dismiss="modal" aria-hidden="true"
                onClick={this.passedDataChangeHandler}>×</button>
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
                  <div style={{"margin-top": "15px"}}>
                    <div className="detailBox">
                      <div className="detailBox">
                        <label>Registered Users</label>
                        <UserTable className="actionBox"
                          tourId={this.props.data._id}
                          regUsers={[this.props.user]}
                          data={this.props.data.reg_users}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-xs-12">
                    <CommentBox tourId={this.props.data._id}
                      url="/tours/comments"
                      active={this.state.open}
                      user={this.props.user}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="btn-inline">
                <button id="delete-button" type="submit"
                  className={deleteBtnClass}
                  onClick={this.handleDelete}
                  form="changeForm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ModalDash;
