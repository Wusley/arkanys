const express = require( 'express' );
const _ = require( 'underscore' );
const router = express.Router();
const fs = require('fs');

module.exports = ( app, mongoose ) => {

  let memberDAO = require( '../DAO/member' )( mongoose );

  app.use( '/', router );

  router.get( '/', async ( req, res, next ) => {

    try {

      let masters = await memberDAO.getMasters();

      let data = [];
      if( masters.length > 0 ) {

        let countMasters = 0;
        for( ; countMasters < masters.length ; countMasters++ ) {

          let lenDisciples = masters[ countMasters ].yourDisciples.length;

          if( ( masters[ countMasters ].yourDisciples && lenDisciples ) || ( masters[ countMasters ].yourMasterId && masters[ countMasters ].yourMasterId.length ) ) {

            let obj = {
              'name': masters[ countMasters ].name,
              'nvl': lenDisciples + 2,
              'discipleMaster': [],
              'disciples': []
            }

            let countDisciples = 0;
            for( ; countDisciples < lenDisciples ; countDisciples++ ) {

              let disciple = await memberDAO.getMemberById( masters[ countMasters ].yourDisciples[ countDisciples ].id );

              if( disciple.master ) {

                obj[ 'discipleMaster' ].push( disciple.name );

              } else {

                obj[ 'disciples' ].push( {
                  'name': disciple.name,
                  'nvl': 2
                } );

              }

            }

            data.push( obj );
          }

        }

      }

      console.log( ( req.session.key !== undefined && req.session.key ) );
      console.log(  _.shuffle( data ) );

      res.render( 'index', {
        title: 'ARKANYS E-SPORTS',
        connected: ( req.session.key !== undefined && req.session.key ),
        membersGraph: _.shuffle( data )
      } );

    } catch( err ) {

      console.error( 'index' );
      console.error( err );

      next( err )
    }

  } );

  router.get( '/staff', async ( req, res, next ) => {

    try {

      let staff = await memberDAO.getStaff();

      res.render( 'staff', {
        title: 'ARKANYS E-SPORTS - Staff',
        connected: ( req.session.key !== undefined && req.session.key ),
        staff: staff
      } );

    } catch( err ) {

      console.error( 'index' );
      console.error( err );

      next( err )
    }

  } );

  router.get( '/regras', ( req, res, next ) => {
    res.render( 'rules', {
      title: 'ARKANYS E-SPORTS - Regras',
      connected: ( req.session.key !== undefined && req.session.key )
    });
  } );

  router.get( '/gifts', ( req, res, next ) => {
    res.render( 'gifts', {
      title: 'ARKANYS E-SPORTS - Gifts',
      connected: ( req.session.key !== undefined && req.session.key )
    });
  } );

  router.get( '/bem-vindos', ( req, res, next ) => {
    res.render( 'bem-vindo', {
      title: 'ARKANYS E-SPORTS - Bem Vindos',
      connected: ( req.session.key !== undefined && req.session.key )
    });
  } );

  router.get( '/mestre-aprendiz', ( req, res, next ) => {
    res.render( 'mestre-aprendiz', {
      title: 'ARKANYS E-SPORTS - Mestre Aprendiz',
      connected: ( req.session.key !== undefined && req.session.key )
    });
  } );

  router.get( '/dicas', ( req, res, next ) => {
    res.render( 'dicas', {
      title: 'ARKANYS E-SPORTS - Dicas',
      connected: ( req.session.key !== undefined && req.session.key )
    });
  } );

  router.get( '/mural-honra', async ( req, res, next ) => {

    try {

      const leaders = './public/img/leaders';
      let countLeaders = await fs.readdirSync( leaders, async ( err, files ) => {
        return files.length;
      } );

      const heads = './public/img/heads';
      let countHeads = await fs.readdirSync( heads, async ( err, files ) => {
        return files.length;
      } );

      const members = './public/img/members';
      let countMembers = await fs.readdirSync( members, async ( err, files ) => {
        return files.length;
      } );

      res.render( 'mural', {
        title: 'ARKANYS E-SPORTS - Mural Honra',
        countLeaders: countLeaders,
        countHeads: _.shuffle( countHeads ),
        countMembers: _.shuffle( countMembers ),
        connected: ( req.session.key !== undefined && req.session.key )
      });

    } catch( err ) {

      console.error( 'index' );
      console.error( err );

      next( err )
    }

  } );

  router.get( '/conecte-se', ( req, res, next ) => {
    res.render( 'connect', {
      title: 'ARKANYS E-SPORTS - Conecte-se',
      connected: ( req.session.key !== undefined && req.session.key )
    });
  } );

  router.get( [ '/peticao', '/petition' ], ( req, res, next ) => {
    res.redirect('https://secure.avaaz.org/en/community_petitions/snail_game_improve_the_ping_brazilian_players_in_the_survival_heroes_app/details/');
  } );

  router.get( '/discord', ( req, res, next ) => {
    res.redirect('https://discord.gg/3KHm4EY');
  } );

  router.get( '/instagram', ( req, res, next ) => {
    res.redirect('https://www.instagram.com/arkanysports/');
  } );

  router.get( '/justificativa', ( req, res, next ) => {
    res.redirect('https://forms.gle/EVPmLLy3UChz99vz6');
  } );

  router.get( '/youtube', ( req, res, next ) => {
    res.redirect('https://www.youtube.com/channel/UCRdweKmKMREDDkZNXB7pCXg/videos');
  } );

  router.get( '/whatsapp', ( req, res, next ) => {
    res.redirect('https://whats.link/queroarkanys');
  } );

};
