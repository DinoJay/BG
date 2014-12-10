/**
 * @jsx React.DOM
 * @flow
 */
// depends on modal.js and jquery loaded in the page
var React = require('react');

var ModalTrigger = React.createClass({
  getDefaultProps: function() {
    return {
      id : "modal"
    };
  },

  handleClick: function(e) {
    $('#'+this.props.id).modal();
  },
  render: function() {
    console.log("ModalTrigger ID", this.props.id);
    return (
      <div onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  },
});

module.exports = ModalTrigger;
