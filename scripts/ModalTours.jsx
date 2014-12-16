/**
 * @jsx React.DOM
 * @flow
 */
var React        = require('react');

var GMap         = require('./assets/Map');
var CommentBox   = require('./assets/CommentBox');
var ModalTrigger = require('./assets/ModalTrigger');

var superagent   = require('superagent');


var ModalTours = React.createClass({
  mixins: [require('./assets/tourDescr')],

  getDefaultProps: function() {
    return({
      data              : [],
      user              : null,
      id                : "modal",
      dataChangeHandler : null,
      fromDashboard     : false
    });
  },

  getInitialState: function() {
    return {
      error: null,
      open: false,
      reg_users: [],
      unregistered: false
    };
  },

  componentDidMount: function() {
    $(this.getDOMNode()).modal({background: true, keyboard: true,
                               show: false});
    var modalSel = "#"+this.props.id;
    $(modalSel).on('hidden.bs.modal', function () {
      this.setState({open: false, unregistered: false});
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

  notifyUnRegister: function() {
    options = {
      position: "left",
      gap: 20,
      className: "warn",
      arrowShow: false,
    };

    console.log("Unregister");
    this.setState({unregistered: true});
    $("#reg-btn").notify("You are unregistered!", options);
  },

  handleRegister: function() {
    options = {
      position: "left",
      gap: 20,
      className: "success",
      arrowShow: false,
    };

    superagent.put('/tours/register')
    .send(this.props.data)
    .end(function(error, res){
      if (error) {
        options.className = "error";
        $("#reg-btn").notify("BoOM! An error has occured!",
                             options);
        console.log(error);
      }
      else {
        // TODO: delete true
        if (res.text === "success"){
          $("#reg-btn").notify("You are registered!", options);
          var reg_users = this.state.reg_users;
          reg_users.push(this.props.user);
          this.setState({
            reg_users: reg_users
          });
          console.log("REG USERS", this.state.reg_users);
        }
        else {
          options.className = "warn";
          console.log("REGISTER RESPONSE", res);
          $("#reg-btn").notify("BoOM! You are already registered "+
                               "for this tour!", options);
        }
      }
    }.bind(this));
  },

  render: function() {
    var regBtnClass = "btn btn-success";
    if (this.state.reg_users !== undefined) {
      if (this.state.reg_users.indexOf(this.props.user) !== -1) {
        console.log("Are you found", this.props.user);
        regBtnClass += " disabled";
      }
      else{
        if(this.state.unregistered)
          regBtnClass = "btn btn-success";
      }
    }

    var regBtn = null;
    if (!this.props.fromDashboard) {
      regBtn = (
        <button id="reg-btn" type="submit"
          className={regBtnClass}
          onClick={this.handleRegister}>
          Register
        </button>
      );
    }
    return (
      <div id={this.props.id} onClick={this.handleClick}
        className="modal" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg" >
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
                {this.descr()}
                <div className="row">
                  <div className="col-md-12 col-xs-12">
                    <GMap defaultRoute={this.props.data.route}/>
                  </div>
                </div>
            </div>
            <CommentBox tourId={this.props.data._id}
              url="/tours/comments" pollInterval={2000}
              active={this.state.open}
              user={this.props.user}
            />
            <div className="modal-footer">
              {regBtn}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ModalTours;
