/*
 var retrievedObject = localStorage.getItem('class');
 if(retrievedObject){
     $('#h').removeClass()
     $('#h').addClass(retrievedObject)
 }

 
$(document).ready(function(){
    $("this").click(function(){
      if($("this").hasClass("liked")){
       $("this").html('<i class="fa fa-h-o" aria-hidden="true"></i>');
        $("this").removeClass("liked");
      localStorage.setItem('class', 'fa fa-heart-o'); 
      }else{
        $("this").html('<i class="fa fa-h" aria-hidden="true"></i>');
        $("this").addClass("liked");
      localStorage.setItem('class', 'fa fa-heart'); 
      }
    }
    );
  });
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
      if(this_.hasClass("liked")){
       this_.html('<i class="fa fa-heart-o" aria-hidden="true"></i>');
         this_.removeClass("liked");
         localStorage.setItem('class', 'fa fa-heart-o'); 
       }else{
         this_.html('<i class="fa fa-heart" aria-hidden="true"></i>');
         this_.addClass("liked");
         localStorage.setItem('class', 'fa fa-heart'); 
       }
     }
   })
 })

   */ 
 