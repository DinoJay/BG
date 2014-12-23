/**
 * @jsx React.DOM
 * @flow
 */
var React      = require('react');
var UserTable = require('./UserTable');
var CryptoJS = require("crypto-js");


var tourDescr = {

  componentWillReceiveProps: function(newProps) {
    var origin = newProps.data.origin;
    var dest = newProps.data.dest;
    var descr = newProps.data.descr;
    var difficulty = newProps.data.difficulty;
    var end_date = newProps.data.end_date;
    var name = newProps.data.name;
    var pers = newProps.data.pers;
    var start_date = newProps.data.start_date;
    var creator  = newProps.data.user;

    this.refs.origin.getDOMNode().innerHTML = origin;
    this.refs.dest.getDOMNode().innerHTML = dest;
    this.refs.descr.getDOMNode().innerHTML = descr;
    this.refs.difficulty.getDOMNode().innerHTML = difficulty;
    this.refs.end_date.getDOMNode().innerHTML = end_date;
    this.refs.pers.getDOMNode().innerHTML = pers;
    this.refs.start_date.getDOMNode().innerHTML = start_date;
    this.refs.creator.getDOMNode().innerHTML = creator;
    // TODO: Without this, there is no additional render triggered
    console.log("Set State", newProps.data.tags);
    this.setState({
      reg_users: newProps.data.reg_users,
      tags: newProps.data.tags
    });
  },

  descr: function() {
    var hash = CryptoJS.MD5(this.props.data.user);
    var gravatarLink = 'http://www.gravatar.com/avatar/'+hash;
    console.log("Props", this.state.reg_users);

    return(
      <div>
        <div className="row">
          <div className="col-md-6 col-xs-6">
            <label>Origin </label>
            <p ref="origin" type="text"
              className=""
            />
          </div>
          <div className="col-md-6 col-xs-6">
            <label>Dest</label>
            <p ref="dest" type="text"
              className=""
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-xs-6">
            <label>Start Date</label>
            <p ref="start_date" type="date"
              className=""
            />
          </div>
          <div className="col-md-6 col-xs-6">
            <label>End Date</label>
            <p ref="end_date" type="date"
              className=""
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-xs-6">
            <label>Persons</label>
            <p ref="pers" type="number"
              className=""
            />
          </div>
          <div className="col-md-6 col-xs-6">
            <label>Difficulty</label>
            <p ref="difficulty" type="number"
              className=""
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-xs-6">
            <label>Description</label>
            <p ref="descr" type="text"
              className=""
            />
          </div>
          <div className="col-md-6 col-xs-6 paragraph-spacer">
            <div className="col-xs-12 col-md-12 nopadding">
              <label>Creator</label>
            </div>
            <div className="col-xs-8 col-md-5 nopadding">
              <div className="col-xs-2 col-md-3 nopadding">
                <div className="commenterImage">
                  <img src={gravatarLink} />
                </div>
              </div>
              <div className="col-xs-10 col-md-9">
                <div>
                  <div className="commentText">
                    <p ref="creator" type="text" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-xs-6">
            <label>Registered Users</label>
            <UserTable
              regUsers={[this.props.user]}
              data={this.state.reg_users}
              tourId={this.props.data._id}
              dataChangeHandler={this.notifyUnRegister}
            />
          </div>
        </div>
        <div className="paragraph-spacer"/>
      </div>
    );
  }
};

module.exports = tourDescr;

