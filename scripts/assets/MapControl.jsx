/**
 * @jsx React.DOM
 */
var React = require('react');

var MapControl = React.createClass({

  render: function() {

    return(
      <div>
        <div className="form-group">
          <label>Origin </label>
          <div className="input-group">
            <input ref="origin" type="text" 
              className="form-control" defaultValue="Brussels"/>
            <span className="input-group-addon">
              <input type="radio" className="btn btn-default" 
                data-toggle="tooltip" data-placement="left" 
                title="Tooltip on left" />
            </span>
          </div>
          </div>     
        <div className="form-group">
          <label>Dest</label>
          <input ref="dest" type="text" 
             className="form-control" defaultValue="Ravenswiede"
          />      
        </div>     
        <div className="form-group">
          <button type="submit" className="btn btn-default">
         <span class="glyphicon glyphicon-zoom-in"></span> 
            Submit
          </button>
        </div>     
      </div>
    );
  }
});

module.exports = MapControl;
