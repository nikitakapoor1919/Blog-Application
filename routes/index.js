var express = require('express');
var router = express.Router();
var Post=require('../models/post')

router.get('/', function(req, res) {
     
            res.render('index', { title: 'Blog App'});
  });

 //For PostMan Checking  
router.get('/posts',async (req,res)=>{
      const post=await Post.find({})

      try{
            res.send(post)
      }
      catch(err){
            res.status(500).send(err)
      }
})
 //For PostMan Checking  
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
 //For PostMan Checking  
router.delete('/post/:id', async (req, res) => {
      try {
        const post = await Post.findByIdAndDelete(req.params.id)
    
        if (!post) res.status(404).send("No item found")
        res.status(200).send()
      } catch (err) {
        res.status(500).send(err)
      }
})
//For Postman Update
router.patch('/post/:id', async (req, res) => {
      try {
        await Post.findByIdAndUpdate(req.params.id, req.body)
        await Post.save()
        res.send(post)
      } catch (err) {
        res.status(500).send(err)
      }
    })

module.exports = router;