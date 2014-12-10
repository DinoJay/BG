/**
 * @jsx React.DOM
 * @flow
 */
var React      = require('react');

var TourDescr = React.createClass({

  getDefaultProps: function() {
    return{
      data: null
    };
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
    this.refs.origin.getDOMNode().innerHTML = origin;
    this.refs.dest.getDOMNode().innerHTML = dest;
    this.refs.descr.getDOMNode().innerHTML = descr;
    this.refs.difficulty.getDOMNode().innerHTML = difficulty;
    this.refs.end_date.getDOMNode().innerHTML = end_date;
    this.refs.pers.getDOMNode().innerHTML = pers;
    this.refs.start_date.getDOMNode().innerHTML = start_date;
  },

  render: function() {
    return(
        <div>
          <div className="col-md-6 col-xs-6">
            <label>Origin </label>
            <p ref="origin" type="text"
              className=""
            />
          </div>
          <div className="col-md-6 col-xs-6">
            <label>Dest</label>
            <p ref="dest" type="text"
              className=""
            />
          </div>
          <div className="col-md-6 col-xs-6">
            <label>Start Date</label>
            <p ref="start_date" type="date"
              className=""
            />
          </div>
          <div className="col-md-6 col-xs-6">
            <label>End Date</label>
            <p ref="end_date" type="date"
              className=""
            />
          </div>
          <div className="col-md-6 col-xs-6">
            <label>Persons</label>
            <p ref="pers" type="number"
              className=""
            />
          </div>
          <div className="col-md-6 col-xs-6">
            <label>Difficulty</label>
            <p ref="difficulty" type="number"
              className=""
            />
          </div>
          <div className="col-md-12 col-xs-12">
            <label>Description</label>
            <p ref="descr" type="text"
              className="paragraph-spacer"
            />
          </div>
        </div>
    );
  }
});

module.exports = TourDescr;
