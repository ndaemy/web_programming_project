const express = require('express');
const Brite = require('../models/brite');
const catchErrors = require('../lib/async-error');

const router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {location: {'$regex': term, '$options': 'i'}},
      {startDate: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const brites = await Brite.paginate(query, {
    sort: {createdAt: -1},
    populate: 'author',
    page: page, limit: limit
  });
  res.render('brites/index', {brites: brites, term: term, query: req.query});
}));

router.get('/new', needAuth, (req, res, next) => {
  res.render('brites/new', {brite: {}});
});

router.get('/:id', catchErrors(async (req, res, next) => {
  const brite = await Brite.findById(req.params.id);

  res.render('brites/show', {brite: brite});
}));

router.post('/', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  var brite = new Brite({
    title: req.body.title,
    author: user._id,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    organizer: req.body.organizer,
    organizerDesc: req.body.organizerDesc,
    fee: req.body.fee
  });
  await brite.save();
  req.flash('success', 'Successfully posted.');
  res.redirect('brites');
}));

module.exports = router;
