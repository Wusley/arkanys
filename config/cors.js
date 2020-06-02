const cors = function( req, res, next ) {
  res.header( 'Access-Control-Allow-Credentials', true );
  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS' );
  res.header( 'Access-Control-Allow-Headers', 'X-Requested-With' );
  next();
};

module.exports = cors;
