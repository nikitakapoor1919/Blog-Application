var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Post=require('../models/post')
var User=require('../models/user')

var moment = require('moment');

const multer=require('multer')

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./uploads/')
  },
  filename:function(req,file,cb)
  {
    cb(null,new Date().toISOString().replace(/:/g, '-')+file.originalname)
  }
})
const upload=multer({storage:storage})
var csrfProtectionToken = csrf();
router.use(csrfProtectionToken);

//Add a new Post
router.get('/add-post',isLoggedIn, function(req, res, next){
  console.log(req.user) // Displays Logged In User Details
  username=req.user.email
  res.render('user/add-post',{ csrfToken: req.csrfToken(), username: username });
});


router.post('/add-post',isLoggedIn,upload.single('image'), function(req,res){
  if(req.body && req.body.text){
    Post.create({
      text: req.body.text,
     // photo: req.file.path,
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
   var id=req.body.id
  console.log(req.body.Text)
  var text=req.body.Text
  Post.findOneAndUpdate(
     {_id:req.body.id}, {$push: {comments:{text:text,postedBy:req.user.email}}},
     function(err,post){
       if(err)
       console.log("Error")
       else{
         console.log('Done')
         res.redirect("/user/add-comment/"+id)
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
            res.render('user/Userhome', {items: postChunk,moment: moment });
          })
});
//User Like Post
router.get('/like/:id',(req,res)=>{
  var count=0;
  Post.find({_id:req.params.id})
  .exec((err,post)=>{
    if (err) console.log(err)
            const alreadyLike = post[0].likes.some(like => like._id == req.user.id);
            console.log(post[0].likes.length)
            var countlikes=post[0].likes.length
            if (alreadyLike) {
              Post.findOneAndUpdate(
                    {_id:req.params.id}, {$pull: {likes:req.user.id}},
                    function(err,post){
                      if(err)
                      console.log("Error")
                      else{
                        console.log('Done')
                        countlikes--;
                        res.send({likeCount:countlikes,text:"notliked"})
                      }
                    }
                  )
          } else {
              Post.findOneAndUpdate(
                    {_id:req.params.id}, {$push: {likes:req.user.id}},
                    function(err,post){
                      if(err)
                      console.log("Error")
                      else{
                        console.log('Done')
                        countlikes++
                        res.send({likeCount:countlikes,text:"liked"})
                      }
                    }
                  )
            
          }
      });
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
// add dp
router.get('/upload-pic',isLoggedIn,(req,res)=>{
  user=req.user
  console.log(user)
  res.render("user/upload-pic",{user:user, csrfToken: req.csrfToken()})
})

router.post('/upload-pic',isLoggedIn,upload.single('myFile'), (req, res) => {
  console.log('Editing')
  id=req.user.id
  console.log(id)
  console.log(req.file)
  User.findOneAndUpdate(
    {_id:id},{$set:{photo:req.file.path}},{upsert:true},
    function(err,user){
      if(err)
      console.log("Error")
      else{
        res.redirect("/user/profile")
      }
    }
  )
})

/*  profile page. */
router.get('/profile', isLoggedIn, function(req, res, next){
  username=req.user.email
  pic=req.user.photo
  console.log(pic)
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
//Remove Profile Pic
router.get('/remove-pic/',isLoggedIn, (req, res) => {
  pic=req.user.photo
  pic=null
  console.log(pic)
  id=req.user.id
  console.log(id)
  User.findOneAndUpdate(
    {_id:id},{$set:{photo:pic}},{upsert:true},
    function(err,user){
      if(err)
      console.log("Error")
      else{
        res.redirect("/user/profile")
      }
    }
  )
})

//Delete post
router.get('/delete/:id',isLoggedIn, (req, res) => {
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
