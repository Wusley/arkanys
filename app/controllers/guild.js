const express = require('express');
const _ = require('underscore');
const cors = require( '../../config/cors' );
const moment = require( 'moment' );
const router = express.Router();

module.exports = ( app, mongoose ) => {

  let memberDAO = require('../DAO/member')( mongoose );

  app.use('/', router);

  router.get( '/cla', async ( req, res, next ) => {

    try {

      let list = await memberDAO.gestList();

      res.render( 'guild', {
        title: 'ARKANYS',
        members: list,
        cod: 200
      });

    } catch( err ) {

      console.error( 'painel' );
      console.error( err );

      res.render('guild', {
        title: 'ARKANYS',
        member: false,
        cod: 500
      });

    }
  });

  router.get( '/membro/:name', async ( req, res, next ) => {

    try {

      let masters = await memberDAO.getMasters();
      let requestsMasters = await memberDAO.getRequestsMasters( req.params.name );

      res.render( 'member', {
        title: 'ARKANYS',
        masters: masters || [],
        moment: moment,
        requestsMasters: requestsMasters || [],
        name: req.params.name,
        cod: 200
      });

    } catch( err ) {

      console.error( 'painel' );
      console.error( err );

      res.render('member', {
        title: 'ARKANYS',
        member: false,
        cod: 500
      });

    }
  });

  router.post( '/member', cors, async ( req, res, next ) => {

    try {

      if( req.body.name ) {

        if( req.body.id ) {

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

        res.redirect( '/cla' );

      } else {

        console.error( 'member Error' );

        res.redirect( '/cla' );

      }

    } catch( err ) {

      console.error( 'member' );
      console.error( err );

      res.redirect( '/cla' );

    }

  } );

  router.post( '/master/request', cors, async ( req, res, next ) => {

    try {

      if( req.body.name && req.body.masterId ) {

        await memberDAO.requestMaster( req.body.masterId, req.body.name );

        res.redirect( '/membro/' + req.body.name );

      } else {

        console.error( 'master request Error' );

        res.redirect( '/membro/' + req.body.name );

      }

    } catch( err ) {

      console.error( 'master request' );
      console.error( err );

      res.redirect( '/membro/' + req.body.name );

    }

  } );

};
