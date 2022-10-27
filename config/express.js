const express = require('express');
const glob = require('glob');

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const session = require('express-session');
const redis = require('redis');
const redisClient = redis.createClient( {
    port      : 11658,               // replace with your port
    host      : '',        // replace with your hostanme or IP address
    password  : ''    // replace with your password
} );

const redisStore = require('connect-redis')(session);

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use( session( {
    secret: '',
    store: new redisStore( { client: redisClient, ttl: 86400 } ),
    saveUninitialized: false,
    resave: false
  } ) );

  // enable files upload
  app.use( fileUpload( {
      createParentPath: true
  } ) );

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

  if( process.env.PROD === 'true' || process.env.PROD === true ) {

    mongoose.connect( '', { useNewUrlParser: true, useUnifiedTopology: true } );

  } else {

    mongoose.connect( '', { useNewUrlParser: true, useUnifiedTopology: true } );

  }

  /*
   * EVENT INITIALIZE MONGODB
   */
   mongoose.connection.once( 'open', () => {

     console.info( 'Mongodb connected!' );

     try {

       console.info( 'Mongodb sucesso!' );

     } catch( err ) {

       console.error( 'mongoose error' );
       console.error( err );

     }
   /*
    * * * * * *
    */

  } );

  mongoose.connection.on( 'error', console.error.bind( console, 'connection error:' ) );
  /*
  * * * * * *
  */

  app.use( ( req, res, next ) => { //Cria um middleware onde todas as requests passam por ele
    if( ( req.headers["x-forwarded-proto"] || "").endsWith( "http" ) ) { //Checa se o protocolo informado nos headers é HTTP
        res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS
    } else { //Se a requisição já é HTTPS
      next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado
    }
  } );

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
        title: 'Arkanys - Erro',
        connected: ( req.session.key !== undefined && req.session.key )
      } );
    } );
  }

  app.use( ( err, req, res, next ) => {
    res.status( err.status || 500 );

    err.status = err.status || 500;

    res.render( 'error', {
      message: err.message,
      error: err,
      title: 'Arkanys - Erro',
      connected: ( req.session.key !== undefined && req.session.key )
    } );
  } );

  return app;
};
