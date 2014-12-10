/**
 * @jsx React.DOM
 * @flow
 */
var React        = require('react');

var GMap         = require('./assets/Map');
var CommentBox   = require('./assets/CommentBox');
var ModalTrigger = require('./assets/ModalTrigger');
var TourDescr    = require('./assets/TourDescr');

var superagent   = require('superagent');

var ModalTours = React.createClass({

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

  handleRegister: function() {
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

  render: function() {
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
            <div className="modal-body modal-resize">
              <div className="row"> 
                <TourDescr data={this.props.data} />
                <div className="col-md-12 col-xs-12"> 
                  <GMap defaultRoute={this.props.data.route}/>
                </div> 
              </div>
            </div>
            <CommentBox tourId={this.props.data._id} 
              url="/tours/comments" pollInterval={2000} 
              active={this.state.open}
            />
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" 
                data-dismiss="modal">
                Close
              </button>
              <button id="reg-btn" type="button"
                className="btn btn-primary" 
                onClick={this.handleRegister}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ModalTours;
