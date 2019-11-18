const express = require('express');
const Bor = require('../models/bor');
// const User = require('../models/user'); 
const Answer = require('../models/answer'); 
const catchErrors = require('../lib/async-error');

const router = express.Router();

// 동일한 코드가 users.js에도 있습니다. 이것은 나중에 수정합시다.
function needAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

/* GET questions listing. */
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {content: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const bors = await Bor.paginate(query, {
    sort: {reg_date: -1}, 
    populate: 'name', 
    page: page, limit: limit
  });
  res.render('bors/index', {bors: bors, query: req.query});
}));

router.get('/new', needAuth, (req, res, next) => {
  res.render('bors/new', {bor: {}});
});

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const bor = await Bor.findById(req.params.id);
  res.render('bors/edit', {bor:bor});
}));

router.get('/:id', catchErrors(async (req, res, next) => {
  const bor = await Bor.findById(req.params.id).populate('author');
  const answers = await Answer.find({bor:bor.id}).populate('author');
  bor.numReads++;    // TODO: 동일한 사람이 본 경우에 Read가 증가하지 않도록???
  await bor.save();
  res.render('bors/show', {bor:bor, answers: answers});
}));

router.post('/:id', catchErrors(async (req, res, next) => {
  const bor = await Bor.findById(req.params.id);

  if (!bor) {
    req.flash('danger', 'Not exist board');
    return res.redirect('back');
  }
  bor.title = req.body.title;
  bor.content = req.body.content;
  
  await bor.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/bors');
}));

router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Bor.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/bors');
}));

router.post('/', needAuth, catchErrors(async (req, res, next) => {
  const user = req.session.user;
  var bor = new Bor({
    title: req.body.title,
    name: user._id,
    content: req.body.content,
    
  });
  await bor.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/bors');
}));

router.post('/:id/answers', needAuth, catchErrors(async (req, res, next) => {
  const user = req.session.user;
  const bor = await Bor.findById(req.params.id);

  if (!bor) {
    req.flash('danger', 'Not exist Board');
    return res.redirect('back');
  }

  var answer = new Answer({
    author: user._id,
    bor: bor._id,
    content: req.body.content
  });
  await answer.save();
  bor.numAnswers++;
  await bor.save();

  req.flash('success', 'Successfully answered');
  res.redirect(`/bors/${req.params.id}`);
}));


module.exports = router;
