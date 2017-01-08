function FocusAcc() {
    console.log("focus");
    $("#login-table").animate({ "margin-top": "70px" }, "slow");
};


// JavaScript Document
$(function () {
		  
		  // moveCloud
		  function moveCloud() {
		        $('.cloud-menu').not('.cloudSelected').animate({top:0},600)
				                      .animate({ top: -15 }, 600, function () {
				                          $(this).animate({ top: -0 }, 500)
									         .animate({ top: -10 }, 500, function () {
										     setTimeout(moveCloud,1);
									         });									  
									  });
		  };
		  moveCloud();//end moveCloud
		  
		  // moveCloud for ie
		  function moveCloudforIE() {
		      $('.cloud-menu-ie').not('.cloudSelected').animate({ top: 0 }, 600)
				                      .animate({ top: -15 }, 600, function () {
				                          $(this).animate({ top: -0 }, 500)
									         .animate({ top: -10 }, 500, function () {
										     setTimeout(moveCloudforIE,1);
									         });									  
									  });
		  };		  
		  
		  //login
		  $('#openLogin').click(function(){
			    $('#login-ground').fadeIn(500);
			    $('#login-table').fadeIn(500);
			    $('#account').focus();
			    $("body").css("overflow-y", "hidden");
		  });

          /*
		  $('#login-ground').click(function () {
			    $('#login-ground').hide();
				$('#login-table').hide();
				$('#account').val("");
				$('#password').val("");				
		  });
          */
		  $('.closeLogin_button').click(function(){
		        $('#login-ground').fadeOut(200);
		        $('#login-table').fadeOut(200);
		        $('#playYoutube-ground').fadeOut(200);
		        $('#Youtube').fadeOut(200);
				$('#account').val("");
				$('#password').val("");
				$("body").css("overflow-y", "scroll");
				$("#login-table").animate({ "margin-top": "150px" }, "slow");
		  });
		  
		  //playYoutube
          $('#playYoutbe-img').mouseenter(function() {
			   $(this).attr('src','/Static/images/Index2_images/systemScreen_play.png');
		  }).mouseleave(function() {
		      $(this).attr('src', '/Static/images/Index2_images/systemScreen.png');
		  }).click(function(){
		     $('#playYoutube-ground').show();
		     $('#playYoutube-ground').after("<iframe id='Youtube' width='853' height='480' src='https://www.youtube.com/watch?v=fP6sriWrX5k' frameborder='0' allowfullscreen></iframe>");
		  });
		  
		  $('.closeLogin_button').click(function(){
			 $('#Youtube').remove();
		  });

    //­º­¶enter µn¤J
		  $("#password").bind("keydown", function (event) {
		      // track enter key
		      var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
		      if (keycode == 13) { // keycode for enter key
		          // force the 'Enter Key' to implicitly click the Update button
		          document.getElementById('login-button').click();
		          return false;
		      } else {
		          return true;
		      }
		  }); // end of function

		  //ToLanguage();
});



function blockDiv(msg, block) {
    $.blockUI({
        message: '<h1><img src="/Statics/img/smallloader.gif" style="vertical-align:middle;"/><span style="line-height:32px;font-size:larger;vertical-align:middle;padding-left:20px;">' + msg + '</span></h1>',
        fadeIn: 700,
        fadeOut: 700,
        showOverlay: block,
        css: {
            width: '350px',
            height: '70px',
            border: 'none',
            padding: '2px',
            backgroundColor: 'gray',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .6,
            color: '#fff',
            'font-size': '15px'
        }
    });
}
function onSubmit() {
    blockDiv('Please Wait...', true);
}