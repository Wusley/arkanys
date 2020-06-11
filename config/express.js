const express = require('express');
const glob = require('glob');

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  /*
  * SETUP MONGODB
  */
  const mongoose = require( 'mongoose' );

  mongoose.connect( 'mongodb://arkanys:arkanys123@geonosis.mongodb.umbler.com:39589/arkanys', { useNewUrlParser: true, useUnifiedTopology: true } );

  /*
   * EVENT INITIALIZE MONGODB
   */
   mongoose.connection.once( 'open', async () => {

     console.info( 'Mongodb connected!' );

     try {

       console.info( 'Mongodb sucesso!' );

     } catch( err ) {

       console.error( 'mongoose error' );
       console.error( err );

       process.exit( 1 );

     }
   /*
    * * * * * *
    */

  } );

  mongoose.connection.on( 'error', console.error.bind( console, 'connection error:' ) );
  /*
  * * * * * *
  */

  var controllers = glob.sync( config.root + '/app/Controllers/*.js' );
  controllers.forEach( ( controller ) => {
    require( controller )( app, mongoose );
  } );

  app.use( ( req, res, next ) => {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
  } );

  if( app.get('env') === 'development' ) {
    app.use( ( err, req, res, next ) => {
      res.status( err.status || 500 );

      err.status = err.status || 500;

      res.render( 'error', {
        message: err.message,
        error: err,
        title: 'Arkanys - Erro'
      } );
    } );
  }

  app.use( ( err, req, res, next ) => {
    res.status( err.status || 500 );

    err.status = err.status || 500;

    res.render( 'error', {
      message: err.message,
      error: err,
      title: 'Arkanys - Erro'
    } );
  } );

  return app;
};
