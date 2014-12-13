/**
 * @jsx React.DOM
 * @flow
 */
var React           = require('react');
var Griddle         = require('griddle-react');
var superagent      = require('superagent');
var TabPanel        = require('react-tab-panel');

var dataMethodMixin = require('./assets/dataMethodMixin');
var Cell            = require('./assets/Cell');
var columnMetaData  = require('./assets/columnMetaData');
var loadScript      = require('./assets/loadScript');

var ModalDash       = require('./ModalDash');
var ModalTours      = require('./ModalTours');

var mainMountNode   = document.getElementById("react-main-mount");
var subMountNode    = document.getElementById("react-sub-mount");

// helper function
Array.prototype.indexOfObj = function arrayObjectIndexOf(property,
                                                         value) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i][property] === value) return i;
    }
    return -1;
};

var ToursCreated = React.createClass({
  mixins: [dataMethodMixin],

  getDefaultProps: function() {
    return {
      modalId: "modal"
    };
  },

  getInitialState: function() {
    return {
      data       : [],
      user       : null,
      tourRecord : []
    };
  },

  componentDidMount: function() {
    superagent.get('/tours/list', function(res){
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
    var curData = this.state.data;
    var index = curData.indexOfObj("_id", updatedTour._id);
    console.log("tourChangeHandler", updatedTour);

    curData[index] = updatedTour;
    this.setState({data: curData});
  },

  tourDeleteHandler: function(updatedTour) {
    var curData = this.state.data;
    var index = curData.indexOfObj("_id", updatedTour._id);
    curData.splice(index, 1);
    this.setState({data: curData});
  },

  render: function(){
    return(
      <div>
        <ModalDash id={this.props.modalId}
          data={this.state.tourRecord}
          user={this.state.user}
          dataChangeHandler={this.tourChangeHandler}
          dataDeleteHandler={this.tourDeleteHandler}
        />
        <Griddle
          getExternalResults={this.dataMethodHelper}
          columnMetadata={columnMetaData}
          customFormatClassName="row" useCustomFormat="true"
          tableClassName="table"
          customFormat={Cell}
          noDataMessage={"No Tours found created by you."}
          myRowData={{
            callback: this.onCellClick,
            cellStyle: {"min-height": 170},
            modalId: this.props.modalId
          }}
        />
      </div>
    );
  }
});

var ToursRegistered = React.createClass({
  mixins: [dataMethodMixin],

  getDefaultProps: function() {
    return {
      modalId: "modal"
    };
  },

  getInitialState: function() {
    return {
      data       : [],
      user       : null,
      tourRecord : []
    };
  },

  componentDidMount: function() {
    superagent.get('/getUsername', function(res){
      if (res.ok){
        var username = res.body.user;
        superagent.get('/tours/list/'+username, function(res){
          console.log(res.body);
          this.setState({
            data: res.body.tours,
            user: res.body.user
          });
        }.bind(this));

      } else console.log('Error', res);
    }.bind(this));
  },

  onCellClick: function(tourRecord) {
    this.setState({tourRecord: tourRecord});
  },

  render: function(){
    return(
      <div>
        <ModalTours id={this.props.modalId}
          data={this.state.tourRecord}
          user={this.state.user}
        />
        <Griddle
          getExternalResults={this.dataMethodHelper}
          columnMetadata={columnMetaData}
          customFormatClassName="row" useCustomFormat="true"
          tableClassName="table"
          customFormat={Cell}
          GMap={this.onCellClick}
          noDataMessage={"No Tours found created by you."}
          myRowData={{
            callback: this.onCellClick,
            cellStyle: {"min-height": 170},
            modalId: this.props.modalId
          }}
        />
      </div>
    );
  }
});

loadScript("mapLoaded");
window.mapLoaded = function() {
  React.render( <ToursCreated modalId="modal1"/>, mainMountNode);
  React.render( <ToursRegistered modalId="modal2"/>, subMountNode);
};
