



window.onload = function(){
  const loginBtn = document.getElementById("logIn-btn");

  loginBtn.addEventListener("click", () => {
    window.location.href = "/login";
  });


  $("#signUp").click(function() {
   
    $.ajax("/signup",{
        "type":"POST",
        "data":{"username":$("#username").val(),"email":$("#email").val(),"password":$("#password").val()}
      })
      .done(function(response){


        $("#myModal").modal("show");
      
        setInterval(function(){
          window.location.href = "/login";

        },2000)

        $("#username").val("")
        $("#email").val("")
        $("#password").val("")

      }).fail(function(){
    
      })

  });
}
 


