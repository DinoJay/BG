/** @jsx React.DOM */

var React = require('react');
var superagent = require('superagent');
var CryptoJS = require("crypto-js");


var UserTable = React.createClass({

  getDefaultProps: function() {
    return {
      data: [],
      regUsers: null,
      tourId: null,
      dataChangeHandler: null
    };
  },

  getInitialState: function() {
    return {
      data: [],
    };
  },

  componentDidMount: function() {
    console.log("Props USerTable", this.props);
    this.setState({data: this.props.data});
  },

  componentWillReceiveProps: function(newProps) {
    console.log("Props USerTable will receive props", newProps);
  },

  render: function() {
    return (
        <div className="actionBox">
          <UserList
            tourId={this.props.tourId}
            data={this.props.data}
            regUsers={this.props.regUsers}
            dataChangeHandler={this.props.dataChangeHandler}
          />
        </div>
    );
  }
});

var UserList = React.createClass({

  getDefaultProps: function() {
    return {
      data: [],
      tourId: null,
      regUsers: null,
      dataChangeHandler: null
    };
  },

  getInitialState: function() {
    return {
      data: [],
    };
  },

  componentWillReceiveProps: function(newProps) {
    console.log("UserTable DATA", newProps.data);
    this.setState({data: newProps.data});
  },

  handleDelete: function(user) {
    var data = this.props.data;
    indexUser = data.indexOf(user);

    if (indexUser !== -1){
      data.splice(indexUser, 1);
      this.setState({data: data});
      if (this.props.dataChangeHandler !== null)
        this.props.dataChangeHandler(this.props.tourId);
    } else {
      console.log("Error: user not found");
      return;
    }

    superagent.del("/tours/reg_users/"+this.props.tourId)
    .send({user: user})
    .end(function(error, res){
      if (!error) console.log("Success, reg user delete");
      else console.log(error);
    }.bind(this));

  },

  render: function() {
    if (this.state.data.length === 0) {
      return <div> No User is currently registered for this tour </div>;
    }
    var userNodes = this.state.data.map(function (user) {
      return (
        <UserEntry
          user={user}
          regUsers={this.props.regUsers}
          handleDelete={this.handleDelete}
        />
      );
    }.bind(this));
    return <div className="commentList">{userNodes}</div>;
  }
});


var UserEntry = React.createClass({

  getDefaultProps: function() {
    return {
      tourId: null,
      user: "NoUser",
      regUsers: null
    };
  },

  notifyDelete: function() {
    this.props.handleDelete(this.props.user);
  },

  render: function() {
    var deletBtn = null;
    var hash = CryptoJS.MD5(this.props.user);
    var gravatarLink = 'http://www.gravatar.com/avatar/'+hash;

    console.log("REGUSERS: ", this.props.regUsers);
    console.log("USER: ", this.props.user);
    if (this.props.regUsers !== null) {
      this.props.regUsers.forEach(function(regUser){
        if (regUser === this.props.user) {
          deletBtn = <div className="col-xs-1 col-md-1">
            <button className="btn btn-xs btn-danger"
              onClick={this.notifyDelete}>
              Del</button>
          </div>;
        }
      }.bind(this));
    }

    return (
      <div className="item row nopadding">
        <div className="col-xs-1 col-md-1 nopadding">
          <div className="commenterImage">
            <img src={gravatarLink} />
          </div>
        </div>
          <div className="col-xs-8 col-md-8">
            <div className=""
              dangerouslySetInnerHTML={{__html: this.props.user}}
            />
          </div>
        {deletBtn}
      </div>
    );
  }
});

module.exports = UserTable;
