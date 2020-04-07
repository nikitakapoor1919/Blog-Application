/*
 var retrievedObject = localStorage.getItem('class');
 if(retrievedObject){
     $('#h').removeClass()
     $('#h').addClass(retrievedObject)
 }
<script>
  var response=" "
   $('.heart').click(function(e){
   e.preventDefault()
   var this_=$(this)
   var id=this_.attr('like-id')
   var URL='/user/like/'+id
   $.ajax({
     url:URL,
     method:'GET',
     data:{},
     success:function(data){
       response=data
      this_.text(data.likeCount);
      if(response.text=="liked"){
        this_.removeClass();
        this_.addClass("fa fa-heart heart")
        this_.append("<div>You like this Post</div>")
         localStorage.setItem('class', 'fa fa-heart heart'); 
      }
      else{
         this_.removeClass();
         this_.addClass("fa fa-heart-o heart")
        localStorage.setItem('class', 'fa fa-heart heart'); 
      }
     }
   })
 })

</script>
   */ 
 
  var response=" "
   $('.heart').click(function(e){
   e.preventDefault()
   var this_=$(this)
   var id=this_.attr('like-id')
   var URL='/user/like/'+id
   $.ajax({
     url:URL,
     method:'GET',
     data:{},
     success:function(data){
       response=data
      this_.text(data.likeCount);
      
     }
   })
 })