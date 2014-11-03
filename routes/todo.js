var mongoose = require( 'mongoose' );

exports.create = function ( req, res ){
  console.log('trigger');
  res.send("HEYYOOO");
};
