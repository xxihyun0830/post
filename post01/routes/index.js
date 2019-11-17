var express = require('express');
  User = require('../models/user');
var router = express.Router();

// 시작 화면 
router.get('/', function(req, res, next) {
  res.render('index');  
});

//로그인 페이지 
router.get('/signin', function(req,res,next){
  res.render('signin');
})

//session을 이용한 로그인
router.post('/signin', function(req, res, next){
  User.findOne({email: req.body.email}, function(err,user){
    if(err){
      res.render('error', {message: "Error", error: err}); 
    } else if(!user || user.password !== req.body.password){
      req.flash('danger', 'Invalid username or password. 다시 입력하세요');
      res.redirect('back');
    }else{
      req.session.user = user;
      req.flash('success', 'Welcome! 로그인 성공');
      res.redirect('/');
    }
  });
});

//session을 이용한 로그아웃
router.get('/signout', function(req, res, next){
  delete req.session.usesr;
  req.flash('success', 'Successfully signed out! 로그아웃 성공!');
  res.redirect('/');
});


module.exports = router;
