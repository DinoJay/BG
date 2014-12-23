/**
 * @jsx React.DOM
 * @flow
 */

function search(cell, filterString) {
  filterString = filterString.toLowerCase();

return (cell.origin.toLowerCase().indexOf(filterString) !== -1 ||
            cell.dest.toLowerCase().indexOf(filterString) !== -1 ||
            cell.name.toLowerCase().indexOf(filterString) !== -1  );

}

var dataMethodMixin = {
  // TODO: fix filtering
  dataMethodHelper: function(filterString, sortColumn,
                             sortAscending, page, pageSize, callback) {
    var initialIndex = page * pageSize;
    var endIndex = initialIndex + pageSize;
    var parRes;
    if (filterString !== "nothing") {
      parRes = [];
      this.state.data.forEach(function(cell){
        console.log("CELL tags", cell.tags);
        console.log("filterString", filterString);
        if (search(cell, filterString)||
            cell.tags.indexOf(filterString) !== -1)
          parRes.push(cell);
      });
      //if (parRes.length === 0) parRes = this.state.data;
    }
    else parRes = this.state.data;

    parRes = parRes.slice(initialIndex, endIndex);

    callback({
      results : parRes,
      totalResults: this.state.data.length
    });
  },
};

module.exports = dataMethodMixin;
