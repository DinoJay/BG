/**
 * @jsx React.DOM
 * @flow
 */
var dataMethodMixin = {
  // TODO: fix filtering
  dataMethodHelper: function(filterString, sortColumn, 
                             sortAscending, page, pageSize, callback) {
    var initialIndex = page * pageSize;
    var endIndex = initialIndex + pageSize;
    var parRes;
    if (filterString !== "") {
      parRes = [];
      this.state.data.forEach(function(cell){
        if (cell.origin.indexOf(filterString) !== -1 ||
            cell.dest.indexOf(filterString) !== -1 ||
            cell.name.indexOf(filterString) !== -1  ) 
          parRes.push(cell);
      });
      if (parRes.length === 0) parRes = this.state.data;
    }
    else parRes = this.state.data;
    parRes = parRes.slice(initialIndex, endIndex);

    callback({
      results : parRes,
      totalResults: parRes.length
    }); 
  },
};
module.exports = dataMethodMixin;
