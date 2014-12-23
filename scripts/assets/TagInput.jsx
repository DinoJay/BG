/** @jsx React.DOM */

var React = require('react');

var TagInput = React.createClass({

  getDefaultProps: function() {
    return {
      initialTags: ["Scheiße"],
      handler: null,
      readOnly: false,
      grid: false
    };
  },

  getInitialState: function() {
    return {
      data: [],
      tagger: null
    };
  },

  componentDidMount: function() {
    var that = this;
    var tagger = $(this.getDOMNode()).tags({
            readOnly: this.props.grid,
            tagData: this.props.initialTags,
            afterAddingTag: function() {
              if (that.props.handler !== null)
                that.props.handler(this.tagsArray);
            }
    });
    this.setState({tagger: tagger});
  },

  componentDidUpdate: function() {
    if (!this.props.readOnly)
      return false;

    var node = this.getDOMNode();
    var tags = this.state.tagger.getTagsWithContent();
    tags.forEach(function(tag) {
      this.state.tagger.removeTag(tag.tag);
    }.bind(this));

    if (this.props.initialTags !== null) {
      this.props.initialTags.forEach(function(tag) {
        this.state.tagger.addTag(tag);
      }.bind(this));
    }

    var sel = $(".tagsID");
    sel.css("padding-bottom","0px");
    $('.tags-input').attr('readonly', true);
    var btn = $(".tag");
    btn.children('a').unbind();

  },

  render: function() {
    return (
        <div className="tagsID" > </div>
    );
  }
});

module.exports = TagInput;
