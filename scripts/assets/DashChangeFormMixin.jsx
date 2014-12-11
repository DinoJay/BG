/**
 * @jsx React.DOM
 * @flow
 */
var React      = require('react');

var superagent = require('superagent');

var Form = {

  getInitialState: function() {
    return{
      dest      : null,
      origin    : null,
      latitude  : null,
      longitude : null,
    };
  },

  componentWillReceiveProps: function(newProps) {
    var origin = newProps.data.origin;
    var dest = newProps.data.dest;
    var descr = newProps.data.descr;
    var difficulty = newProps.data.difficulty;
    var end_date = newProps.data.end_date;
    var name = newProps.data.name;
    var pers = newProps.data.pers;
    var start_date = newProps.data.start_date;

    this.refs.origin.getDOMNode().defaultValue = origin;
    this.refs.dest.getDOMNode().defaultValue = dest;
    this.refs.descr.getDOMNode().defaultValue = descr;
    this.refs.difficulty.getDOMNode().defaultValue = difficulty;
    this.refs.end_date.getDOMNode().defaultValue = end_date;
    this.refs.name.getDOMNode().defaultValue = name;
    this.refs.pers.getDOMNode().defaultValue = pers;
    this.refs.start_date.getDOMNode().defaultValue = start_date;

    this.setState({route: newProps.data.route});
    console.log("new PROPS", newProps.data);
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
        var dest   = this.refs.dest.getDOMNode().value;

        this.setState({origin: origin, dest: dest});
      }.bind(this)
    );
    google.maps.event.addListener(dest_compl, 'place_changed',
      function() {
        var dest   = this.refs.dest.getDOMNode().value;
        var origin = this.refs.origin.getDOMNode().value;

        this.setState({origin: origin, dest: dest});
      }.bind(this)
    );
  },

  handleLoc: function(e) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      var lat_long_str = '('+longitude.toString()+
                         ', '+ latitude.toString() +')';
      this.refs.origin.getDOMNode().value = lat_long_str;
      var dest   = this.refs.dest.getDOMNode().value;
      var origin = this.refs.origin.getDOMNode().value;
      this.setState({latitude : latitude,
                    longitude : longitude,
                    origin: origin,
                    dest : dest
                    });
    // TODO: Callback
    }.bind(this));
  },

  getUpdatedData: function() {
    return ({
      _id        : this.props.data._id,
      descr      : this.refs.descr.getDOMNode().value,
      dest       : this.refs.dest.getDOMNode().value,
      difficulty : this.refs.difficulty.getDOMNode().value,
      end_date   : this.refs.end_date.getDOMNode().value,
      name       : this.refs.name.getDOMNode().value,
      pers       : this.refs.pers.getDOMNode().value,
      reg_users  : this.props.data.reg_users,
      origin     : this.refs.origin.getDOMNode().value,
      start_date : this.refs.start_date.getDOMNode().value,
      user       : this.props.data.user,
      route      : this.state.route
    });
  },

  form: function() {
    return(
      <form
        className="bs-example bs-example-form">
        <div className="form-group">
          <label>Tour Name</label>
          <input ref="name" type="text"
            className="form-control"
            placeholder="Name of your Biking Event"
          />
        </div>
        <div className="form-group">
          <label>Origin </label>
          <div className="input-group">
            <input ref="origin" type="text"
              className="form-control"
              defaultValue={this.state.origin}
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
            defaultValue={this.state.dest}
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input ref="start_date" type="date"
            className="form-control"
            placeholder="Start Date of your Bike Tour"
            defaultValue={this.props.data.start_date}
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input ref="end_date" type="date"
            className="form-control"
            placeholder="End Date of your Bike Tour"
            defaultValue={this.props.data.end_date}
          />
        </div>
        <div className="form-group">
          <label>Persons</label>
          <input ref="pers" type="number"
            className="form-control"
            placeholder="limit of persons who can join you"
            defaultValue={this.props.data.pers}
          />
        </div>
        <div className="form-group">
          <label>Difficulty</label>
          <input ref="difficulty" type="number"
            className="form-control"
            placeholder="Denote here the level of Difficulty"
            defaultValue={this.props.data.difficulty}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea ref="descr" type="text"
            className="form-control"
            placeholder="Add a description to your event"
            defaultValue={this.props.data.descr}
          />
        </div>
      </form>
    );
  }
};

module.exports = Form;
