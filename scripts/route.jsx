/**
 * @jsx React.DOM
 */
var React = require('react');
var mountNode = document.getElementById("react-main-mount");
var google_maps_api_key = "AIzaSyBdU5jAnqlZLJt0j75X9dOwHAJ9AavGWs8";
var GMap = require('./assets/map');

var MapRouter = React.createClass({

  getInitialState: function(){
    return {
      origin: "Brussels",
      destination: "Ravenswiede"
    };
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var origin = this.refs.origin.getDOMNode().value ;
    var destination = this.refs.dest.getDOMNode().value ;
    console.log("Submit");
    console.log(origin);
    this.setState({origin: origin, destination: destination});
  },

  render: function() {

    return(
      <div className="col-lg-4">
        <form onSubmit={this.handleSubmit} className="form-group">
           <input ref="dest" type="text" className="form-control"
                  defaultValue="Brussels"
           />      
           <input ref="origin" type="text" className="form-control"
                  defaultValue="Ravenswiede"
           />      
          <input type="submit" bsStyle='primary' value="Submit" />
      </form>
         <GMap origin={this.state.origin} 
           dest={this.state.destination} />
      </div>
    );
  }
});

React.render(<MapRouter />, mountNode);
