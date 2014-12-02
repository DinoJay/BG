/**
 * @jsx React.DOM
 * @flow
 */
var React          = require('react');
var GMap           = require('./Map');
var CommentBox     = require('./CommentBox');

var superagent     = require('superagent');

exports.ModalTrigger = React.createClass({
  handleClick: function(e) {
    $('#modal').modal();
  },
  render: function() {
      return (
        <div onClick={this.handleClick}>
          {this.props.children}
        </div>
      );
  },
});

exports.Modal = React.createClass({

  getDefaultProps: function() {
    return({
      data: {},
      user: null
    });
  },
  getInitialState: function() {
    return {
      error: null,
      open: false
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
  onClose: function() {
    $('#reg').popover('destroy');
    console.log("CLOSE");
    this.setState({error : null});
  },
  componentDidUpdate: function() {
    // show popover after render
    var that = this;
    if (this.state.open) {
      if (this.state.error !== null) {
        if (this.state.error) {
          $('#reg').popover('show');
          $(".popover").addClass("pop-alert");
          $(".popover-title").addClass("pop-alert-bold");
        }
        else {
          $('#reg').popover('show');
          $(".popover").addClass("pop-success");
          $(".popover-title").addClass("pop-success-bold");
        }
      }
    } else {
      $('#reg').popover('destroy');
    }
  },
  render: function() {
      $('.modal-backdrop').css({
              width:'auto', //probably not needed
              height:'auto', //probably not needed 
       });
    var reg_btn_class = "btn btn-default";
    var notifier = null;
    var titlePopover;
    var textPopover;

    if (!this.state.error) {
      titlePopover = "Success";
      textPopover = "You are now registered to this event. "+
        "For more info see your profile page!";
    } else {
      titlePopover = "Failure";
      textPopover = "You are already registered to this event. "+
        "You cannot do it again!";
    }

    return (
      <div id="modal" onClick={this.handleClick} 
        className="modal" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" 
                data-dismiss="modal" aria-hidden="true"
                onClick={this.onClose}>×</button>
              <h4 className="modal-title">Event</h4>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <GMap defaultRoute={this.props.data.route}/>
                  </div>
                </div>
              </div>
            </div>
            <CommentBox tourId={this.props.data._id} 
              url="/tours/comments" pollInterval={2000} 
              active={this.state.open}
            />
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" 
                data-dismiss="modal" onClick={this.onClose}>
                Close
              </button>
              <button id="reg"
                data-toggle="popover" 
                title={titlePopover}
                data-content={textPopover}
                data-trigger="focus"
                data-placement="top" type="button"
                className={reg_btn_class}
                onClick={this.register}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
