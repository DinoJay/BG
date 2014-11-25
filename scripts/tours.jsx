/**
 * @jsx React.DOM
 * @flow
 */
var React          = require('react');
var Griddle        = require('griddle-react');
var superagent     = require('superagent');
var ModalTrigger   = require('./assets/Modal.jsx').ModalTrigger;
var Modal          = require('./assets/Modal.jsx').Modal;
var columnMetaData = require('./assets/columnMetaData');
var mountNode      = document.getElementById("react-main-mount");

var OtherComponent = React.createClass({
  getDefaultProps: function(){
    return {
      data                      : {},
      map_id                    : "dir-panel",
    };
  },

  handleClick: function(){
    this.props.callback(this.props.data);
  },

  render: function(){
    return(
      <ModalTrigger>
        <div className="col-md-4" onClick={this.handleClick}>
          <div className="panel panel-default custom-component">
            <div className="row">
              <div className="col-md-12">
                <h4>{this.props.data.name}</h4>
              </div>
              <div className="col-md-6 col-xs-4">
                <small>
                  Begin: {this.props.data.start_date} <br></br>
                  End: {this.props.data.end_date}
                </small>
              </div>
              <div className="col-md-6 col-xs-4">
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

var EventPage = React.createClass({
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
      console.log(res.body);
      this.setState({
        data: res.body
      });
    }.bind(this));
  },

  // TODO: fix filtering
  dataMethod: function(filterString, sortColumn, sortAscending,
                                     page, pageSize, callback) {
    var initialIndex = page * pageSize;
    var endIndex = initialIndex + pageSize;
    var parRes;
    if (filterString !== "") {
      parRes = [];
      this.state.data.forEach(function(cell){
        if (cell.origin.indexOf(filterString) !== -1 ||
            cell.dest.indexOf(filterString) !== -1 ||
            cell.name.indexOf(filterString) !== -1  ) 
          parRes.push(cell);
      });
      if (parRes.length === 0) parRes = this.state.data;
    }
    else parRes = this.state.data;
    parRes = parRes.slice(initialIndex, endIndex);
    callback({
      results : parRes,
      totalResults: this.state.data.length
    });
  },

  onCellClick: function(singleTourData) {
    this.setState({singleTourData : singleTourData});
  },

  render: function(){
    return(
      <div className="row">
        <div className="header-off" />
        <div className="col-md-12">
        <Modal ref="payload"
            header={this.props.header}
            body={this.props.body}
            footer={this.props.footer}
            data={this.state.singleTourData}>
        </Modal>
        <Griddle
          getExternalResults={this.dataMethod}
          columnMetadata={columnMetaData}
          customFormatClassName="row" useCustomFormat="true"
          showFilter="true" tableClassName="table"
          customFormat={OtherComponent} showSettings="true"
          noDataMessage={"Please wait. Data is loading"}
          callback={this.onCellClick}
        />
      </div>
    </div>
    );
  }
});

window.mapLoaded = (function() {
  React.render(<EventPage />, mountNode);
});
