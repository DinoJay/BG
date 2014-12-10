/**
 * @jsx React.DOM
 * @flow
 */
var React           = require('react');
var Griddle         = require('griddle-react');
var superagent      = require('superagent');
var TabPanel = require('react-tab-panel');

var dataMethodMixin = require('./assets/dataMethodMixin');
var Cell            = require('./assets/Cell');
var columnMetaData  = require('./assets/columnMetaData');
var loadScript      = require('./assets/loadScript');

var Modal           = require('./ModalDash');

var mainMountNode       = document.getElementById("react-main-mount");
var subMountNode       = document.getElementById("react-sub-mount");

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

    curData[index] = updatedTour;
    this.setState({data: curData});
  },

  render: function(){
    return(
      <div>
        <Modal id={this.props.modalId} 
          data={this.state.tourRecord}
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
          modalId="modal1"
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
        <Modal id={this.props.modalId} 
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
          callback={this.onCellClick}
          cellStyle={{"min-height": 170}}
          modalId="modal2"
        />
      </div>
    );
  }
});

var Dashboard = React.createClass({

    getInitialState: function(){
        return {
            activeIndex: 1
        };
    },

    handleChange: function(index){
        this.setState({
            activeIndex: index
        });
    },

    render: function() {
        return (
          <TabPanel activeIndex={this.state.activeIndex}
            onChange={this.handleChange}
            titleStyle={{padding: 10}}
            >
            <div title="Created Tours">
              <ToursCreated modalId="modal1"/>
            </div>
            <div title="Created Tours">
              <div title="Registered Tours">
                <ToursRegistered modalId="modal2"/>
              </div>
            </div>
          </TabPanel>
        );
    }
});
loadScript("mapLoaded");
window.mapLoaded = function() {
  React.render(<Dashboard />, mainMountNode);
};
