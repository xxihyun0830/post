const express = require('express');
const Post = require('../models/posts');

const Comment = require('../models/comment');
const catchErrors = require('../lib/async-error');

const router = express.Router();

// 게시판을 이용하기 위해서는 로그인을 해야 함.
// function needId(req, res, next){
//     if(req.session.user){
//         next();
//     }else{
//         req.flash('danger', 'Please singin first! 로그인 후, 게시판 이용이 가능합니다.');
//         res.redirect('/signin');
//     }
// }

// 1.GET/post : 게시판 목록보기
router.get('/', catchErrors(async(req,res,next)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    // pagination을 확인하기 위해서 1페이지당 3개 게시글이 올라오게 함

    var query = {};
    const term = req.query.term;

    // 게시글 목록이 보여질 때는 제목만 보이도록 한다.
    if(term){
        query = {$or: [
            {title: {'$regex': term, '$options': 'i'}},
        ]};
    }

    //게시글 순서는 최근에 작성된 것이 가장 위로 오도록 한다.
    const posts = await Post.paginate(query,{
        sort: {reg_date: -1},
        populate: 'name',
        page: page,
        limit: limit
    });
    res.render('posts/index', {posts: posts, query: req.query});
}));

//2. GET/posts/:id :게시글 상세보기 (게시글 내용보기)
router.get('/:id', catchError(async(req,res,next) => {
    const post = await Post.findById(req,res,params.id).populate('name');
    const comments = await Comment.find({post:post.id}).populate('name');
    await post.save();
    res.render('posts/show',{post: post, comments: comments});
}));


//3. GET/posts/new : 게시글 쓰기 페이지
router.get('/new',(req,res,next)=>{
    res.render('posts/new', {post:{}});
});

// 3-1. 게시글을 쓸 때 로그인이 필요한 경우
// router.get('/new', needId, (req,res,next)=>{
//     res.render('posts/new', {post:{}});
// });


//4. POST/posts : 게시글 생성
router.post('/', needId, catchError(async(req, res, next)=>{
    const user = req.session.user;
    var post = new Post({
        id = user._email, //로그인은 name, email, pw로 하는데, email은 PK
        title = req.body.title,
        content = req.body.content,
        name = user._name
    });
    await post.save();
    req.flash('success', 'Successfully posted!. 새로운 게시글 작성 완료');
    res.redirect('/posts');
}));

//5. DELETE/posts/:id : 게시글 삭제

//6. GET/posts/:id/edit : 게시글 수정
router.get('/:id/edit', catchErrors(async(req, res, next)=>{
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', {post:post});
}));

//6-1. PUT/posts/:id/update : 게시글 수정 내용을 게시판에 적용


//8. 댓글 달기
router.post('/:id/comments', needId, catchError(async(req, res, next)=>{
    const user = req.session.user;
    const question = await Post.findById(req.params.id);

    if(!post){
        req.flash('danger','Not Exist Post' );
        return res.redirect('back');
    }

    var comment = new Comment({
        id: user._email,
        post : post._id
    })
}))
