const express = require('express');
const Post= require('../models/post');
const Answer = require('../models/answer'); 
const catchErrors = require('../lib/async-error');

const router = express.Router();


/* GET posts listing. */

//모든 게시글 불러오기 ->view > posts > index.pug
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
  const posts = await Post.paginate(query, {
    sort: {reg_date: -1}, 
    populate: 'name', 
    page: page, limit: limit
  });
  res.render('posts/index', {posts: posts, query: req.query});
}));

// 새로운 게시글 작성하기 ->view > posts > new.pug
router.get('/new', (req, res, next) => {
  res.render('posts/new', {post: {}});
});

//게시글 수정하기  -> view > post > edit.pug
router.get('/:id/edit', catchErrors(async (req, res, next) => {
  const post = await Post.find({_id:req.params.id});
  req.flash('success','게시글 수정 완료! ');
  res.render('posts/edit',{post : post});
}));

// 게시글 전체 목록 보기
router.get('/:id', catchErrors(async (req, res, next) => {
  const post = await Post.findOne({_id:req.params.id}).populate('name');
  const answers = await Answer.find({post: post.id}).populate('name'); //
  post.numReads++;    
  await post.save();
  res.render('posts/show', {post: post, answers: answers});
}));
~~

//게시글 update
router.put('/:id', catchErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    req.flash('danger', 'Not exist post');
    return res.redirect('back');
  }
  post.title = req.body.title;
  post.content = req.body.content;
  
  await Post.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/posts');
}));

// 게시글 delete
router.delete('/:id', catchErrors(async (req, res, next) => {
  await Post.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/posts');
}));

//게시글 올리기 
router.post('/new', catchErrors(async (req, res, next) => {
  
  var post = new Post({
    title: req.body.title,
    content: req.body.content,
    
  });
  await post.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/');
}));

//댓글달기
router.post('/:id/answers',  catchErrors(async (req, res, next) => {
  
  const post = await Post.find(req.params.id);

  if (!post) {
    req.flash('danger', 'Not exist post');
    return res.redirect('back');
  }

  var answer = new Answer({
    post: post._id, 
    content: req.body.content
  });
  await answer.save();
  post.numAnswers++;
  await post.save();

  req.flash('success', 'Successfully answered');
  res.redirect('/posts/${req.params.id}'); //댓글 오류가 생기는 ㅂ
}));

module.exports = router;
