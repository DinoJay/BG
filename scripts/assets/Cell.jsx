/**
 * @jsx React.DOM
 * @flow
 */
var React          = require('react');
var Griddle        = require('griddle-react');
var superagent     = require('superagent');

var ModalTrigger   = require('./ModalTrigger');

var Cell = React.createClass({
  getDefaultProps: function(){
    return {
      data   : {},
      myRowData: {},
      //cellStyle  : {"min-height": "100px"},
      //callback: null,
      //modalId: "modal"
    };
  },

  handleClick: function(){
    this.props.myRowData.callback(this.props.data);
  },

  render: function(){
    //console.log("Cell", this.props);
    return(
      <ModalTrigger iD={this.props.myRowData.modalId}>
        <div className="col-md-4" onClick={this.handleClick}>
          <div style={this.props.myRowData.cellStyle}
            className="cell panel panel-default custom-component">
            <div className="row">
              <div className="col-md-12">
                <h4>{this.props.data.name}</h4>
              </div>
              <div className="col-md-4 col-xs-4">
                <small>
                  Begin: {this.props.data.start_date} <br></br>
                  End: {this.props.data.end_date}
                </small>
              </div>
              <div className="col-md-8 col-xs-4">
                <small>
                  Origin: {this.props.data.origin} <br></br>
                  Dest: {this.props.data.dest}
                </small>
              </div>
            </div>
          </div>
        </div>
      </ModalTrigger>
    );
  }
});
module.exports = Cell;

