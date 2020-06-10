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

        let obj = {
          'name': masters[ countMasters ].name,
          'nvl': lenDisciples + 2,
          'discipleMaster': [],
          'disciples': []
        }

        if( masters[ countMasters ].yourDisciples && masters[ countMasters ].yourDisciples.length ) {

          let countDisciples = 0;
          for( ; countDisciples < masters[ countMasters ].yourDisciples.length ; countDisciples++ ) {

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

        }

        data.push( obj );

      }

      let availableDisciples = await memberDAO.getAvailableDisciples();

      let countAvailableDisciples = 0;
      for( ; countAvailableDisciples < availableDisciples.length ; countAvailableDisciples++ ) {

        data.push( {
          'name': availableDisciples[ countAvailableDisciples ].name,
          'nvl': 1
        } );

      }

      console.log( data );

      res.render( 'index', {
        title: 'ARKANYS E-SPORTS',
        membersGraph: _.shuffle( data )
      } );

    } catch( err ) {

      console.error( 'index' );
      console.error( err );

      res.render( 'index', {
        title: 'ARKANYS',
        cod: 500
      } );

    }

  });

  router.get('/regras', (req, res, next) => {
    res.render('rules', {
      title: 'ARKANYS E-SPORTS - Regras'
    });
  });

  router.get( ['/peticao', '/petition'], (req, res, next) => {
    res.redirect('https://secure.avaaz.org/en/community_petitions/snail_game_improve_the_ping_brazilian_players_in_the_survival_heroes_app/details/');
  });

  router.get( '/discord', (req, res, next) => {
    res.redirect('https://discord.gg/3KHm4EY');
  });

};
