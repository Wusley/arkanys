const express = require('express');
const _ = require('underscore');
const cors = require( '../../config/cors' );
const moment = require( 'moment' );
const router = express.Router();

module.exports = ( app, mongoose ) => {

  let memberDAO = require('../DAO/member')( mongoose );

  app.use('/', router);

  router.get( '/membros', async ( req, res, next ) => {

    try {

      let list = await memberDAO.gestList();

      res.render( 'members', {
        title: 'ARKANYS',
        members: list,
        cod: 200
      });

    } catch( err ) {

      console.error( 'painel' );
      console.error( err );

      res.render('members', {
        title: 'ARKANYS',
        member: false,
        cod: 500
      });

    }
  });

  router.get( '/membro/:name', async ( req, res, next ) => {

    try {

      let member = await memberDAO.getMemberByName( req.params.name );

      let disciples = [];
      if( member.yourDisciples.length > 0 ) {

        let count = 0;
        for( ; count < member.yourDisciples.length ; count++ ) {

          let disciple = await memberDAO.getMemberById( member.yourDisciples[ count ].id );

          disciples.push( disciple );

        }

      }

      let availableDisciples = await memberDAO.getAvailableDisciples();

      let master = ( member.yourMasterId && member.yourMasterId !== '' ) ? await memberDAO.getMemberById( member.yourMasterId ) : false;

      let masters = await memberDAO.getMasters();

      let requestsDisciples = await memberDAO.getRequestsDisciples( req.params.name ); // pedidos enviados aos aprendizes
      let requestsPendingsDisciples = await memberDAO.getRequestsPendingsDisciples( req.params.name ); // pedidos recebidos dos mestres

      let requestsMasters = await memberDAO.getRequestsMasters( req.params.name ); // pedidos enviados aos mestres
      let requestsPendings = await memberDAO.getRequestsPendings( req.params.name ); // pedidos recebidos dos aprendizes

      let availableMasters = [];

      _.map( masters, ( master ) => {

        let status = false;

        if( master.name == member.name ) {

          status = true;

        }

        _.map( requestsMasters, ( request ) => {

          if( request.infoMaster.name == master.name ) {

            status = true;

          }

        } );


        if( !status ) {

          availableMasters.push( master );

        } else {

          status = false;

        }

      } );

      res.render( 'member', {
        title: 'ARKANYS',
        member: member || false,
        disciples: disciples.length > 0 ? disciples : false,
        master: master || false,
        availableMasters: availableMasters || false,
        availableDisciples: availableDisciples || false,
        moment: moment,
        requestsDisciples: requestsDisciples || false,
        requestsMasters: requestsMasters || false,
        requestsPendingsDisciples: requestsPendingsDisciples || false,
        requestsPendings: requestsPendings || false,
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
            whatsapp: req.body.whatsapp,
            master: ( ( req.body.master == '1' || req.body.master == 'on' ) ? true : false )
          } );

        } else {

          await memberDAO.create( {
            name: req.body.name,
            whatsapp: req.body.whatsapp,
            master: ( ( req.body.master == '1' || req.body.master == 'on' ) ? true : false )
          } );

        }

        res.redirect( '/membros' );

      } else {

        console.error( 'member Error' );

        res.redirect( '/membros' );

      }

    } catch( err ) {

      console.error( 'member' );
      console.error( err );

      res.redirect( '/membros' );

    }

  } );

  router.post( '/master/request', cors, async ( req, res, next ) => {

    try {

      if( req.body[ 'member-id' ] && req.body[ 'master-id' ] ) {

        await memberDAO.requestMaster( req.body[ 'master-id' ], req.body[ 'member-id' ] );

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

  router.post( '/disciple/request', cors, async ( req, res, next ) => {

    try {

      console.log( req.body );

      if( req.body[ 'disciple-id' ] && req.body[ 'master-id' ] ) {

        await memberDAO.requestDisciple( req.body[ 'disciple-id' ], req.body[ 'master-id' ] );

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

  router.post( '/master/request/accept', cors, async ( req, res, next ) => {

    try {

      if( req.body.id ) {

        await memberDAO.acceptRequestMaster( req.body.id );

        res.redirect( '/membro/' + req.body.name );

      } else {

        console.error( 'master request accept Error' );

        res.redirect( '/membro/' + req.body.name );

      }

    } catch( err ) {

      console.error( 'master request' );
      console.error( err );

      res.redirect( '/membro/' + req.body.name );

    }

  } );

  router.post( '/disciple/request/accept', cors, async ( req, res, next ) => {

    try {

      if( req.body.id ) {

        await memberDAO.acceptRequestDisciple( req.body.id );

        res.redirect( '/membro/' + req.body.name );

      } else {

        console.error( 'disciple request accept Error' );

        res.redirect( '/membro/' + req.body.name );

      }

    } catch( err ) {

      console.error( 'master request' );
      console.error( err );

      res.redirect( '/membro/' + req.body.name );

    }

  } );

  router.post( [ '/master/request/cancel', '/master/request/refuse' ], cors, async ( req, res, next ) => {

    try {

      if( req.body.id ) {

        await memberDAO.cancelRequestMaster( req.body.id );

        res.redirect( '/membro/' + req.body.name );

      } else {

        console.error( 'master request cancel-refuse Error' );

        res.redirect( '/membro/' + req.body.name );

      }

    } catch( err ) {

      console.error( 'master request cancel-refuse' );
      console.error( err );

      res.redirect( '/membro/' + req.body.name );

    }

  } );

  router.post( [ '/disciple/request/cancel', '/disciple/request/refuse' ], cors, async ( req, res, next ) => {

    try {

      if( req.body.id ) {

        await memberDAO.cancelRequestDisciple( req.body.id );

        res.redirect( '/membro/' + req.body.name );

      } else {

        console.error( 'disciple request cancel-refuse Error' );

        res.redirect( '/membro/' + req.body.name );

      }

    } catch( err ) {

      console.error( 'disciple request cancel-refuse' );
      console.error( err );

      res.redirect( '/membro/' + req.body.name );

    }

  } );

  router.post( '/master/unlink', cors, async ( req, res, next ) => {

    try {

      if( req.body[ 'master-id' ] && req.body[ 'member-id' ] ) {

        await memberDAO.unlinkMaster( req.body[ 'master-id' ], req.body[ 'member-id' ] );

        res.redirect( '/membro/' + req.body.name );

      } else {

        console.error( 'master unlink' );

        res.redirect( '/membro/' + req.body.name );

      }

    } catch( err ) {

      console.error( 'master request' );
      console.error( err );

      res.redirect( '/membro/' + req.body.name );

    }

  } );
  
};
