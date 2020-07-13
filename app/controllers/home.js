const express = require( 'express' );
const _ = require( 'underscore' );
const router = express.Router();

module.exports = ( app, mongoose ) => {

  let memberDAO = require( '../DAO/member' )( mongoose );

  app.use( '/', router );

  router.get( '/', async ( req, res, next ) => {

    try {

      let masters = await memberDAO.getMasters();

      let data = [];

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

      // let availableDisciples = await memberDAO.getAvailableDisciples();
      //
      // let countAvailableDisciples = 0;
      // for( ; countAvailableDisciples < availableDisciples.length ; countAvailableDisciples++ ) {
      //
      //   if( !availableDisciples[ countAvailableDisciples ].master ) {
      //
      //     data.push( {
      //       'name': availableDisciples[ countAvailableDisciples ].name,
      //       'nvl': 1
      //     } );
      //
      //   }
      //
      // }

      res.render( 'index', {
        title: 'ARKANYS E-SPORTS',
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
      title: 'ARKANYS E-SPORTS - Regras'
    });
  } );

  router.get( '/gifts', ( req, res, next ) => {
    res.render( 'gifts', {
      title: 'ARKANYS E-SPORTS - Gifts'
    });
  } );

  router.get( '/bem-vindos', ( req, res, next ) => {
    res.render( 'bem-vindo', {
      title: 'ARKANYS E-SPORTS - Bem Vindos'
    });
  } );

  router.get( '/mestre-aprendiz', ( req, res, next ) => {
    res.render( 'mestre-aprendiz', {
      title: 'ARKANYS E-SPORTS - Mestre Aprendiz'
    });
  } );

  router.get( '/dicas', ( req, res, next ) => {
    res.render( 'dicas', {
      title: 'ARKANYS E-SPORTS - Dicas'
    });
  } );

  router.get( '/conecte-se', ( req, res, next ) => {
    res.render( 'connect', {
      title: 'ARKANYS E-SPORTS - Conecte-se'
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
