/**
 * @jsx React.DOM
 * @flow
 */
var React           = require('react');
var Griddle         = require('griddle-react');
var superagent      = require('superagent');

var dataMethodMixin = require('./assets/dataMethodMixin');
var Cell            = require('./assets/Cell');
var columnMetaData  = require('./assets/columnMetaData');
var loadScript      = require('./assets/loadScript');

var Modal           = require('./ModalDash');
var mountNode       = document.getElementById("react-main-mount");

// helper function
Array.prototype.indexOfObj = function arrayObjectIndexOf(property,
                                                         value) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i][property] === value) return i;
    }
    return -1;
};

var MyEvents = React.createClass({
  mixins: [dataMethodMixin],

  getDefaultProps: function(){
    return {
      map_id : "dir-panel",
    };
  },

  getInitialState: function() {
    return {
      data       : [],
      tourRecord : []
    };
  },

  componentDidMount: function() {
    superagent.get('/tours/list', function(res){
      console.log("BODY TOURS", res.body.tours);
      this.setState({
        data: res.body.tours,
        user: res.body.user
      });
    }.bind(this));
  },

  onCellClick: function(tourRecord) {
    this.setState({tourRecord: tourRecord});
  },

  tourChangeHandler: function(updatedTour) {
    console.log("ID", updatedTour._id);
    var curData = this.state.data;
    var index = curData.indexOfObj("_id", updatedTour._id);

    console.log("Data", curData);
    console.log("ID of changed TOUR", updatedTour._id);
    console.log("Index in this data", index);
    curData[index] = updatedTour;
    console.log("curData", curData[index]);
    this.setState({data: curData});
  },

  render: function(){
    return(
      <div>
        <Modal ref="payload" data={this.state.tourRecord}
          user={this.state.user} 
          dataChangeHandler={this.tourChangeHandler}
        />
        <Griddle
          getExternalResults={this.dataMethodHelper}
          columnMetadata={columnMetaData}
          customFormatClassName="row" useCustomFormat="true"
          tableClassName="table"
          customFormat={Cell} 
          GMap={this.onCellClick}
          noDataMessage={"No Tours found created by you."}
          callback={this.onCellClick}
          cellStyle={{"min-height": 170}}
        />
      </div>
    );
  }
});

loadScript("mapLoaded");
window.mapLoaded = function() {
  React.render(<MyEvents />, mountNode);
};
