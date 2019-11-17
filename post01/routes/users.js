var express = require('express');
 User = require('../models/user')
var router = express.Router();

function needId(req,res,next){
    if(req.session.user){
        next();
    }else{
        req.flash('danger', '로그인 먼저 해주세요');
        res.redirect('/signin');
    }
}

function validateForm(form, options){
    var name = form.name || "";
    var email = form.email || "";
    name = name.trim();
    email = email.trim();

    if(!name){
        return '이름 입력하세요';
    }
    if(!email){
        return '이메일 입렵하세요';
    }

    if(!form.password && options.nddePassword){
        return '비밀번호 입력하세요'
    }
    if(form.password !== form.password_confirmation){
        return '비밀번호 불일치!! 재입력!!';
    }
    if(from.password.length < 2){
        return '최소 3자리부터 입력하세요';
    }

    return null;
}

/* GET users listing. */
router.get('/', needId, (req, res, next) =>{
  User.find({}, function(err, users){
      if(err){
          return next(err);
      }
      console.log("err", err);
      console.log(users);

      res.renter('users/index', {users: users});
  });
});


router.get('/', (req, res, next)=> {
    console.log(req.params);
    res.render('users/new', {message : req.flash()});
});

//회원가입
router.post('/', (req,res, next)=>{
    var err = validateForm(req.body, {needPassword: true});
    if(err){
        req.flash('danger',err);
        return res.redirect('back');
    }
    User.findOne({email: rea.body.email}, function(err,user){
        if(err){
            return next(err);
        }
        if(user){
            req.flash('danger', 'Email address already exist');
            return res.redirect('back');
        }
        var newUser = new User({
            name : req.body.name,
            email : req.body.email
        });
        newUser.password = req.body.password;

        newUser.save(function(err){
            if(err){
                return next(err);
            }else{
                req.flash('success', '회원가입 성공');
                res.redirect('/');
            }
        });
    });
});

module.exports = router;


