/**
 * @jsx React.DOM
 * @flow
 */
var React           = require('react');
var Griddle         = require('griddle-react');
var superagent      = require('superagent');

var Cell            = require('./assets/Cell');
var dataMethodMixin = require('./assets/dataMethodMixin');
var loadScript      = require('./assets/loadScript');
var Modal           = require('./ModalTours');
var columnMetaData  = require('./assets/columnMetaData');
var CommentBox      = require('./assets/CommentBox');

var mountNode       = document.getElementById("react-main-mount");

var EventPage = React.createClass({
  mixins: [dataMethodMixin],

  getDefaultProps: function() {
    return { 
      singleTourData: null
    };
  },

  getInitialState: function() {
    return {
      data: []
    };
  },

  componentDidMount: function() {
    superagent.get('/tours/list', function(res){
      //console.log(res);
      this.setState({
        data: res.body.tours,
        user: res.body.user
      });
    }.bind(this));
  },

  onCellClick: function(singleTourData) {
    this.setState({singleTourData : singleTourData});
  },

  render: function(){
    return(
      <div className="row">
        <div className="header-off" />
        <div className="col-md-12">
          <h1>Find your very own tour and enjoy!</h1>
          <p className="lead">
            Here you can explore all tours created by other users. Feel 
            free to register if you like to.
          </p>
          <Modal ref="payload" data={this.state.singleTourData}  />
        <Griddle
          getExternalResults={this.dataMethodHelper}
          columnMetadata={columnMetaData}
          customFormatClassName="row" useCustomFormat="true"
          showFilter="true" tableClassName="table"
          customFormat={Cell} showSettings="true"
          noDataMessage={"Please wait. Data is loading"}
          callback={this.onCellClick}
          cellStyle={{"min-height": "100px"}} 
        />
      </div>
    </div>
    );
  }
});

// load google map service with callback
loadScript("mapLoaded");
window.mapLoaded = function() {
  React.render(<EventPage />, mountNode);
};
