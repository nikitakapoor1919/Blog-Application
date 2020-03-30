var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Post=require('../models/post')

var csrfProtectionToken = csrf();
router.use(csrfProtectionToken);

router.get('/add-post',isLoggedIn, function(req, res, next){
  console.log(req.user) // Displays Logged In User Details
  username=req.user.email
  res.render('user/add-post',{ csrfToken: req.csrfToken(), username: username });
});


router.post('/add-post',isLoggedIn,function(req,res){
  if(req.body && req.body.text){
    Post.create({
      text: req.body.text,
      photo: req.body.photo,
      postedBy: req.user.email
      },function(error,post){
        if(error) return console.log("Error in adding the post to database");
        console.log("Post created");
        res.redirect("/user/Userhome")
      }
    );
  }
});


/* GET : user profile page. */
router.get('/profile', isLoggedIn, function(req, res, next){
  username=req.user.email
  pic=req.user.photo
  console.log(username)
  Post.find({"postedBy":username})
  .exec(function (err,post){
    if(err) console.log("Error")
    else {
      var postChunk = []; var chunkSize = 3;
        for(var i=0; i < post.length; i += chunkSize){
          postChunk.push(post.slice(i, i + chunkSize));
        }
        console.log(postChunk);
        res.render('user/profile',{username:username,items:postChunk,pic:pic});
    }
  })
  
});
router.get('/Userhome',isLoggedIn, function(req, res) {
  Post.find(function(err, docs){
    var postChunk = []; var chunkSize = 3;
    for(var i=0; i < docs.length; i += chunkSize){
      postChunk.push(docs.slice(i, i + chunkSize));
    }
    console.log(postChunk);
    res.render('user/Userhome', {items: postChunk});
  });
});
router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');
});

router.use('/', isNotLoggedIn, function(req,res, next){
  next();
});

/* GET and POST : user signup page. */
router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect:'/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}))

/* GET and POST : user signin page. */
router.get('/signin', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect:'/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));
module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function isNotLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
