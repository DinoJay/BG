/**
 * @jsx React.DOM
 * @flow
 */
// depends on modal.js and jquery loaded in the page
var React = require('react');

var ModalTrigger = React.createClass({
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

module.exports = ModalTrigger;
