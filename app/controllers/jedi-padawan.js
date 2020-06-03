const express = require('express');
const _ = require('underscore');
const cors = require( '../../config/cors' );
const router = express.Router();

module.exports = ( app, mongoose ) => {

  let memberDAO = require('../DAO/member')( mongoose );

  app.use('/', router);

  router.get('/painel', async (req, res, next) => {

    try {

      let list = await memberDAO.gestList();

      res.render('panel', {
        title: 'ARKANYS',
        members: list,
        cod: 200
      });

    } catch( err ) {

      console.error( 'painel' );
      console.error( err );

      res.render('panel', {
        title: 'ARKANYS',
        member: false,
        cod: 500
      });

    }
  });

  router.post( '/member', cors, async ( req, res, next ) => {

    try {

      console.log( req.body );

      if( req.body.name ) {

        if( req.body.id ) {

          console.log( 'aqui' );

          await memberDAO.update( req.body.id, {
            name: req.body.name,
            master: ( ( req.body.master == '1' || req.body.master == 'on' ) ? true : false )
          } );

        } else {

          await memberDAO.create( {
            name: req.body.name,
            master: ( ( req.body.master == '1' || req.body.master == 'on' ) ? true : false )
          } );

        }

        res.redirect( '/painel' );

      } else {

        console.error( 'member Error' );

        res.redirect( '/painel' );

      }

    } catch( err ) {

      console.error( 'member' );
      console.error( err );

      res.render('panel', {
        title: 'ARKANYS',
        member: false,
        cod: 500
      });

    }

  } );

};
