const express = require('express');
const _ = require('underscore');
const router = express.Router();

module.exports = (app, mongoose) => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'ARKANYS E-SPORTS'
  });
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
