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
  // const articles = [new Article(), new Article()];
  res.render('rules', {
    title: 'ARKANYS E-SPORTS - Regras',
    members: _.union( [ first ], _.shuffle( others ) )
  });
});
