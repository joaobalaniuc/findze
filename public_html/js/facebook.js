//==============================================
// FACEBOOK API
//==============================================

var fb = {
    login: function () {

        //alert("login");

        facebookConnectPlugin.login(['email', 'public_profile', 'user_birthday'], function (result) {

            //alert("fb.login() = " + JSON.stringify(result));
            /*localStorage.fb_id = result.authResponse.userID;
             localStorage.fb_status = 'connected';*/

            localStorage.fb_token = result.authResponse.accessToken;

            //facebookConnectPlugin.api("/me?fields=id,birthday,gender,first_name,middle_name,age_range,last_name,name,picture.width(400),email", [],
            facebookConnectPlugin.api("/me?fields=id,email,birthday,gender,first_name,middle_name,last_name,picture.width(400)", [],
                    function (result) {

                        alert("/me = " + JSON.stringify(result));
                        alert(result.picture.data.url);

                        if (typeof result.email !== "undefined") {
                            var email = result.email;
                        }
                        else {
                            var email = result.id;
                        }
                        /*
                         preloader();
                         // RUN AJAX
                         $.ajax({
                         url: localStorage.server + "/user_facebook.php",
                         data: {
                         user_fb: result.id,
                         user_fb_token: localStorage.fb_token,
                         user_fb_pic: result.picture.data.url,
                         user_pass: localStorage.fb_token,
                         user_email: email,
                         user_genre: result.gender,
                         user_first_name: result.first_name,
                         user_middle_name: result.middle_name,
                         user_last_name: result.last_name
                         },
                         type: 'GET',
                         dataType: 'jsonp',
                         jsonp: 'callback',
                         timeout: localStorage.timeout
                         })
                         .always(function () {
                         preloader(false);
                         })
                         
                         .fail(function () {
                         
                         })
                         
                         .done(function (res) {
                         if (res !== null) {
                         
                         if (res.error) {
                         alert(res.error);
                         return;
                         }
                         if (res.id) {
                         localStorage.fb_id = result.id;
                         localStorage.user_id = res.id;
                         localStorage.user_email = email;
                         localStorage.user_pass = localStorage.fb_token;
                         window.location.href = "index.html";
                         }
                         
                         } // res not null
                         }); // after ajax
                         */

                    },
                    function (error) {
                        alert("/me failed = " + error);
                    });
            //
        }, function (err) {
            alert('an error occured while trying to login. please try again. Err:' + err);
        });
    },
    
    logout: function () {
        facebookConnectPlugin.logout(
                function () {
                    //localStorage.removeItem("fb_id");
                    window.location.href = "index.html";
                },
                function () {
                    //alert("logout error");
                });
    }

};
