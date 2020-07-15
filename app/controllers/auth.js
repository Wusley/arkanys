const express = require( 'express' );
const _ = require( 'underscore' );
const cors = require( '../../config/cors' );
const moment = require( 'moment' );
const router = express.Router();

module.exports = ( app, mongoose ) => {

  let memberDAO = require( '../DAO/member' )( mongoose );

  app.use( '/', router );

  router.post( '/login-facebook', cors, async ( req, res, next ) => {

    try {

      if(
        req.body[ 'accessToken' ] &&
        req.body[ 'data_access_expiration_time' ] &&
        req.body[ 'expiresIn' ] &&
        req.body[ 'signedRequest' ] &&
        req.body[ 'userID' ] ) {

        let login = await memberDAO.loginFacebook(
          req.body[ 'accessToken' ],
          req.body[ 'data_access_expiration_time' ],
          req.body[ 'expiresIn' ],
          req.body[ 'signedRequest' ],
          req.body[ 'userID' ]
        );

        req.session.key = login._id;

        // req.session.save();

        res.redirect( '/membro/' + login.name );

      } else {

        console.error( 'login' );

        res.redirect( '/'  );

      }

    } catch( err ) {

      console.error( 'master login' );
      console.error( err );

      res.redirect( '/' );

    }

  } );

  router.post( '/login-google', cors, async ( req, res, next ) => {

    try {

      if(
        req.body[ 'token' ] &&
        req.body[ 'userID' ] ) {

        let login = await memberDAO.loginGoogle(
          req.body[ 'token' ],
          req.body[ 'userID' ]
        );

        req.session.key = login._id;

        // req.session.save();

        res.redirect( '/membro/' + login.name );

      } else {

        console.error( 'login' );

        res.redirect( '/'  );

      }

    } catch( err ) {

      console.error( 'master login' );
      console.error( err );

      res.redirect( '/' );

    }

  } );

  router.post( '/logout', cors, async ( req, res, next ) => {

    try {

      req.session.destroy( async function( err ) {

        if( err ){

          console.log( err );

        } else {

          if( req.body.id ) {

            let logout = await memberDAO.logout( req.body.id );

          } else {

            console.error( 'logout' );

          }

          res.redirect( '/' );

        }

      } );



    } catch( err ) {

      console.error( 'master logout' );
      console.error( err );

      res.redirect( '/' );

    }

  } );

};
