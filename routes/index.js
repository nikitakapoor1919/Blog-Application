var express = require('express');
var router = express.Router();
var Post=require('../models/post')

router.get('/', function(req, res) {
      Post.find(function(err, docs){
        var postChunk = []; var chunkSize = 3;
        for(var i=0; i < docs.length; i += chunkSize){
          postChunk.push(docs.slice(i, i + chunkSize));
        }
        console.log(postChunk);
        res.render('index', { title: 'Blog App',items: postChunk});
      });
  });
router.get('/posts',async (req,res)=>{
      const post=await Post.find({})

      try{
            res.send(post)
      }
      catch(err){
            res.status(500).send(err)
      }
})

router.post('/post',async (req,res)=>{
      const post=new Post(req.body)

      try{
            await post.save()
            res.send(post)
      }
      catch(err){
            res.status(500).send(err)
      }
})


module.exports = router;