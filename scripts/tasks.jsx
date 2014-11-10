/**
 * @jsx React.DOM
 */
var $          = require('jquery');
var superagent = require('superagent');
var React      = require('react');
var Griddle    = require('griddle-react');

$(document).ready(function() {
  $('.task-delete').click(function(event) {
    $target = $(event.target);
    superagent.del('/tasks/' + $target.attr('data-task-id'))
              .end(function(error, res){
                console.log("HEYY");
                console.log(res);
              });
  });
});

/*
React.render(
  <Griddle results={[]} tableClassName="table" showFilter={true} 
    showSettings={true} columns={["name", "city", "state", "country"]}/>,
    document.body
);
*/
