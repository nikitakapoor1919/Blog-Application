var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Post=require('../models/post')
var User=require('../models/user')

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

//Add comment
router.get('/add-comment/:id',isLoggedIn, function(req, res, next){
  Post.find({_id:req.params.id})
  .exec( function(err, post){
    var postChunk = []; var chunkSize = 3;
    for(var i=0; i < post.length; i += chunkSize){
      postChunk.push(post.slice(i, i + chunkSize));
    }
    console.log(postChunk);
    res.render('user/add-comment', {items: postChunk,csrfToken: req.csrfToken() ,id:req.params.id});
  })
});
router.post('/add-comment',isLoggedIn, (req, res) => {
  console.log(req.user.email)
  console.log(req.body.id)
  console.log(req.body.Text)
  var text=req.body.Text
  Post.findOneAndUpdate(
     {_id:req.body.id}, {$push: {comments:{text:text,postedBy:req.user.email}}},
     function(err,post){
       if(err)
       console.log("Error")
       else{
         console.log('Done')
         res.redirect("/user/Userhome")
       }
     }
   )
 })
 //User Home
router.get('/Userhome',isLoggedIn, function(req, res) {
  username=req.user.email
  console.log(username)
  Post.find({}).sort({created:-1})
      .exec( function(err, post){
            var postChunk = []; var chunkSize = 3;
            for(var i=0; i < post.length; i += chunkSize){
              postChunk.push(post.slice(i, i + chunkSize));
            }
            console.log(postChunk);
            res.render('user/Userhome', {items: postChunk});
          })
});

//Edit User
router.get('/edit',isLoggedIn,(req,res)=>{
  user=req.user
  console.log(user)
  res.render("user/edit",{user:user, csrfToken: req.csrfToken()})
})

router.post('/edit', isLoggedIn, (req, res) => {
  console.log('Editing')
  id=req.user.id
  console.log(id)
  User.findOneAndUpdate(
    {_id:id},{$set:{name:req.body.Name}},{upsert:true},
    function(err,user){
      if(err)
      console.log("Error")
      else{
        res.redirect("/user/profile")
      }
    }
  )
})

/* GET : user profile page. */
router.get('/profile', isLoggedIn, function(req, res, next){
  username=req.user.email
  pic=req.user.photo
  console.log(username)
  Post.find({"postedBy":username}).sort({created:-1})
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

//Delete post
/*
router.get('/delete/:id',isLoggedIn,(req,res)=>{
  user=req.user
  console.log(user)
  res.render("user/delete",{user:user, csrfToken: req.csrfToken()})
})

router.post('/delete/:id',isLoggedIn, (req, res) => {
  var id=req.params.id
  Post.deleteOne({_id:id},function(err,post){
    if(err){
      console.log("Error")
    }
    else{
      console.log(post)
      res.redirect("/user/profile")
    }
  })
})
*/
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
  successRedirect:'/user/Userhome',
  failureRedirect: '/user/signup',
  failureFlash: true
}))

/* GET and POST : user signin page. */
router.get('/signin', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect:'/user/Userhome',
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
