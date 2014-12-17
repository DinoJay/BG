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
var ModalTours      = require('./ModalTours');
var columnMetaData  = require('./assets/columnMetaData');
var CommentBox      = require('./assets/CommentBox');

var mountNode       = document.getElementById("react-main-mount");

var TourPage = React.createClass({
  mixins: [dataMethodMixin],

  getDefaultProps: function() {
    return {
      singleTourData: null,
      modalId: "modalTours"
    };
  },

  getInitialState: function() {
    return {
      data: []
    };
  },

  componentDidMount: function() {
    superagent.get('/tours/listAll', function(res){
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
    console.log("Received USER", this.state.user);
    return(
      <div className="row">
        <div className="col-md-12">
          <h1>Find your very own tour and enjoy!</h1>
          <p className="lead">
            Here you can explore all tours created by other users. Feel
            free to register if you like to.
          </p>
          <ModalTours id={this.props.modalId}
            data={this.state.singleTourData}
            user={this.state.user}
          />
        <Griddle
          getExternalResults={this.dataMethodHelper}
          columnMetadata={columnMetaData}
          customFormatClassName="row"
          useCustomFormat="true"
          showFilter="true"
          tableClassName="table"
          customFormat={Cell}
          showSettings="true"
          noDataMessage={"Please wait. Data is loading"}
          callback={this.onCellClick}
          cellStyle={{"min-height": "100px"}}
          modalId={this.props.modalId}
          myRowData={{
            callback: this.onCellClick,
            cellStyle: {"min-height": 170},
            modalId: this.props.modalId
          }}
        />
      </div>
    </div>
    );
  }
});

// load google map service with callback
loadScript("mapLoaded");
window.mapLoaded = function() {
  React.render(<TourPage modalId="ModalTours" />, mountNode);
};
