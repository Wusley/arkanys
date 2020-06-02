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

      console.log( list );

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

      if( req.body.name ) {

        await memberDAO.create( {
          name: req.body.name,
          master: ( ( req.body.master == '1' || req.body.master == 'on' ) ? true : false )
        } );

        let list = await memberDAO.gestList();

        res.render('panel', {
          title: 'ARKANYS',
          members: list,
          cod: 200
        });

      } else {

        console.error( 'member Error' );

        res.render('panel', {
          title: 'ARKANYS Lider',
          name: false,
          cod: 500
        });

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
