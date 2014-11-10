/**
 * @jsx React.DOM
 */
//React.render(<TodoApp></TodoApp> , document.body);
React = require('react');
Griddle = require('griddle-react');
var mountNode = document.getElementById("react-main-mount");

React.render(
  <Griddle results={[]} tableClassName="table" showFilter={true} 
    showSettings={true} columns={["name", "city", "state", "country"]}/>,
    mountNode
);
