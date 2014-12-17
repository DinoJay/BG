/** @jsx React.DOM */

var React = require('react');
var superagent = require('superagent');
var CryptoJS = require("crypto-js");

var Comment = React.createClass({

  getDefaultProps: function() {
    return{
      user: null
    };
  },

  render: function() {
    var rawText= this.props.children.toString();
    var hash = CryptoJS.MD5(this.props.user);
    var gravatarLink = 'http://www.gravatar.com/avatar/'+hash;

    return (
      <li>
        <div className="commenterImage">
          <img src={gravatarLink} />
        </div>
        <div className="commentText">
          <p className=""
            dangerouslySetInnerHTML={{__html: rawText}} />
          <span className="date sub-text">{this.props.user}</span>
        </div>
      </li>
    );
  }
});

var CommentBox = React.createClass({

  getDefaultProps: function() {
    return {
      active: false,
      tourId: null,
      user: null
    };
  },

  getInitialState: function() {
    return {
      data: [],
    };
  },

  loadCommentsFromServer: function() {
    superagent.get("/tours/comments/"+this.props.tourId, function(res) {
      this.setState({data: res.body.comments});
      // TODO:
      console.log("COMMENTS", res.body.comments);
      if (res.body.comments.length >= 3) {
        var backdropHeightExt = (parseInt($('.modal-backdrop')[0].style
                                          .height)+152)+'px';
        $('.modal-backdrop').css({
                                 'height':backdropHeightExt,
                                  });
      }
    }.bind(this));
  },

  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comments.push(comment);
    this.setState({data: comments});

    superagent.put("/tours/comments/"+this.props.tourId)
    .send({comment: comment})
    .end(function(error, res){
      if (!error) this.setState({data: res.body.comments});
      else console.log(error);
    }.bind(this));
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (!prevProps.active && this.props.active){
      this.loadCommentsFromServer();
    }
    else {
      if (prevProps.active && !this.props.active)
        this.setState({data: []});
    }
  },

  render: function() {
    return (
      <div className="detailBox">
        <div className="titleBox">
          <label>Comment Box</label>
          <div className="CommentBox">
            <p className="taskDescription">
              Add your comment here!
            </p>
          </div>
        </div>
        <div className="actionBox">
          <CommentList user={this.props.user} data={this.state.data} />
          <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        </div>
      </div>
    );
  }
});

var CommentList = React.createClass({

  getDefaultProps: function() {
    return{
      user: null
    };
  },

  render: function() {
    var commentNodes = this.props.data.map(function (comment, index) {
      return (
        <Comment user={comment.user}>{comment.text}</Comment>
      );
    }.bind(this));
    return <ul className="commentList">{commentNodes}</ul>;
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.refs.text.getDOMNode().value.trim();

    this.props.onCommentSubmit({text: text});

    this.refs.text.getDOMNode().value = '';
    return false;
  },

  render: function() {
    return (
      <form className="form-inline" role="form">
        <div className="form-group">
          <input className="form-control" type="text"
            placeholder="Say something..." ref="text" />
        </div>
        <div className="form-group">
          <button className="btn btn-default"
            onClick={this.handleSubmit}>
            Add
          </button>
        </div>
      </form>
    );
  }
});

module.exports = CommentBox;
