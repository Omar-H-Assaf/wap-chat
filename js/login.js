



window.onload = function(){
    const loginBtn = document.getElementById("singUpButton");
  
    loginBtn.addEventListener("click", () => {
      window.location.href = "/signup";
    });
  
  
    $("#singInButton").click(function() {
     
      $.ajax("/login",{
          "type":"POST",
          "data":{"email":$("#email").val(),"password":$("#password").val()}
        })
        .done(function(response){
         console.log("done")
         window.location.href = "/";
  
        }).fail(function(){
            console.log("fail")
            $("#alert-success").show();

            setTimeout(function(){
              $("#alert-success").hide();
    
            },2000)
        })
  
    });
  }
   
  
  
  