const express = require('express');
const _ = require('underscore');
const router = express.Router();
const members = require('../models/members');

let first = _.first( members ) ;
let others = _.rest( members ) ;

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {
  // const articles = [new Article(), new Article()];
  res.render('index', {
    title: 'ARKANYS E-SPORTS',
    members: _.union( [ first ], _.shuffle( others ) )
  });
});

router.get('/regras', (req, res, next) => {
  res.render('rules', {
    title: 'ARKANYS E-SPORTS - Regras',
    members: _.union( [ first ], _.shuffle( others ) )
  });
});

router.get( ['/peticao', '/petition'], (req, res, next) => {
  res.redirect('https://secure.avaaz.org/en/community_petitions/snail_game_improve_the_ping_brazilian_players_in_the_survival_heroes_app/details/');
});

router.get( '/discord', (req, res, next) => {
  res.redirect('https://discord.gg/3KHm4EY');
});
