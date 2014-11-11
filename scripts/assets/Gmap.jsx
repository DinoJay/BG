/** @jsx React.DOM */                                                     
var React = require('react');
var googleMap = require('./googleMap');

var Gmap = React.createClass({
  componentDidMount: function() {
        var el = this.getDOMNode();
        googleMap.create(el);
  },

  componentDidUpdate: function() {
        var el = this.getDOMNode();
        //d3Cloud.update(el, this.getCloudState());
  },

  getCloudState: function() {
    /*
    return {
      data: this.props.data
    };
    */
      
  },

  componentWillUnmount: function() {
        var el = this.getDOMNode();
        //d3Cloud.destroy(el);
  },

  render: function() {
    return (
      <div className=""></div>
    );
      
  }
});
module.exports = Gmap;
