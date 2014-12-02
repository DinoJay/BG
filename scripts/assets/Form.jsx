/**
 * @jsx React.DOM
 * @flow
 */
var React = require('react');

var Form = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getDefaultProps: function() {
    return({
      data              : null,
      getOriginDest     : null,
      dataChangeHandler : null,
      handleSubmit      : null
    });
  },

  getInitialState: function() {
    return{
      _id        : null,
      descr      : null,
      dest       : null,
      difficulty : null,
      end_date   : null,
      name       : null,
      pers       : null,
      reg_users  : null,
      origin     : null,
      start_date : null,
      user       : null,
    };
  },

  componentWillReceiveProps: function(newProps) {
    this.refs.origin.getDOMNode().defaultValue = newProps.data.origin;
    this.refs.dest.getDOMNode().defaultValue = newProps.data.dest;

    this.setState({
      _id        : newProps.data._id,
      descr      : newProps.data.descr,
      dest       : newProps.data.dest,
      difficulty : newProps.data.difficulty,
      end_date   : newProps.data.end_date,
      name       : newProps.data.name,
      pers       : newProps.data.pers,
      reg_users  : newProps.data.reg_users,
      origin     : newProps.data.origin,
      start_date : newProps.data.start_date,
      user       : newProps.data.user,
    });
  },

  componentDidMount: function() {
    var origin_compl = new google.maps
                            .places
                            .Autocomplete(this.refs.origin.getDOMNode());
    var dest_compl = new google.maps
                              .places
                              .Autocomplete(this.refs.dest.getDOMNode());

    google.maps.event.addListener(origin_compl, 'place_changed',
      function() {
        var origin = this.refs.origin.getDOMNode().value;
        this.setState({origin: origin});
        this.props.getOriginDest(this.state.origin, 
                                 this.state.dest);
        console.log(this.state.origin);
      }.bind(this)
    );
    google.maps.event.addListener(dest_compl, 'place_changed',
      function() {
        var dest   = this.refs.dest.getDOMNode().value;
        this.setState({dest: dest});
        this.props.getOriginDest(this.state.origin, this.state.dest);
      }.bind(this)
    );
  },

  handleLoc: function(e){
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      var lat_long_str = '('+longitude.toString()+
                         ', '+ latitude.toString() +')';
      this.refs.origin.getDOMNode().value = lat_long_str;
      this.setState({latitude : latitude,
                    longitude : longitude,
                    });
    }.bind(this));
  },

  render: function() {
    console.log("latitude", this.state.latitude,
                "longitude", this.state.longitude);

    return(
      <form onSubmit={this.props.handleSubmit} 
        className="bs-example bs-example-form">
        <div className="form-group">
          <label>Event Name</label>
          <input ref="name" type="text" 
            className="form-control" 
            placeholder="Name of your Biking Event"
            valueLink={this.linkState('name')}
          />
        </div>
        <div className="form-group">
          <label>Origin </label>
          <div className="input-group">
            <input ref="origin" type="text" 
              className="form-control" 
              defaultValue={this.props.data.origin}
            />
            <span className="input-group-btn">
              <button className="btn btn-default"
                onClick={this.handleLoc}>
                <span className="glyphicon glyphicon-home"/>
              </button>
            </span>
          </div>
        </div>
        <div className="form-group">
          <label>Dest</label>
          <input ref="dest" type="text" 
            className="form-control" 
            defaultValue={this.props.data.dest}
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input ref="start_date" type="date"
            className="form-control"
            placeholder="Start Date of your Bike Tour"
            valueLink={this.linkState('start_date')}
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input ref="end_date" type="date"
            className="form-control"
            placeholder="End Date of your Bike Tour"
            valueLink={this.linkState('end_date')}
          />
        </div>
        <div className="form-group">
          <label>Persons</label>
          <input ref="pers" type="number"
            className="form-control"
            placeholder="limit of persons who can join you"
            valueLink={this.linkState('pers')}
          />
        </div>
        <div className="form-group">
          <label>Difficulty</label>
          <input ref="difficulty" type="number"
            className="form-control"
            placeholder="Denote here the level of Difficulty"
            valueLink={this.linkState('difficulty')}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea ref="descr" type="text" 
            className="form-control" 
            placeholder="Add a description to your event"
            valueLink={this.linkState('descr')}
          />
        </div>
        <div className="form-group">
          <button id="submit-button" type="submit" 
           className="btn btn-default">
            Re-Save
          </button>
        </div>
      </form>
    );
  }
});

module.exports = Form;
