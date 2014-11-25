/**
 * @jsx React.DOM
 * @flow
 */
var React          = require('react');
var GMap           = require('./Map');

var superagent     = require('superagent');

exports.ModalTrigger = React.createClass({
  handleClick: function(e) {
    $('#modal').modal();
  },
  render: function() {
      var Trigger = this.props.trigger;
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
    data: {}
    });
  },
  componentDidMount: function() {
      // Initialize the modal, once we have the DOM node
      // TODO: Pass these in via props
    $(this.getDOMNode()).modal({background: true, keyboard: true, 
                               show: false});
  },
  componentWillUnmount: function() {
      $(this.getDOMNode()).off('hidden');
  },
  // This was the key fix --- stop events from bubbling
  handleClick: function(e) {
      e.stopPropagation();
  },
  register: function() {
    console.log("REGISTER");
    superagent.put('/tours/register')
    .send(this.props.data)
    .end(function(error, res){
      console.log(error);
      console.log(res);
    });
  },
  render: function() {
    return (
      <div id="modal" onClick={this.handleClick} 
        className="modal fade" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" 
                data-dismiss="modal" aria-hidden="true">×</button>
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
            <div className="modal-footer">
              <button type="button" className="btn btn-default" 
                data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary"
                onClick={this.register}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
