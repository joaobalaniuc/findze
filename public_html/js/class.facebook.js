//==============================================
// FACEBOOK API
//==============================================

var fb = {
    login: function () {

        //myApp.showIndicator();

        // get status 1st
        //facebookConnectPlugin.getLoginStatus(function (response) {

        facebookConnectPlugin.login(['email', 'public_profile', 'user_birthday'], function (result) {

            //alert("fb.login() = " + JSON.stringify(result));
            /*localStorage.fb_id = result.authResponse.userID;
             localStorage.fb_status = 'connected';*/

            localStorage.fb_token = result.authResponse.accessToken;

            //facebookConnectPlugin.api("/me?fields=id,birthday,gender,first_name,middle_name,age_range,last_name,name,picture.width(400),email", [],
            facebookConnectPlugin.api("/me?fields=id,email,birthday,gender,first_name,middle_name,last_name,picture.width(400)", [],
                    function (result) {

                        if (typeof result.email !== "undefined") {
                            var email = result.email;
                        }
                        else {
                            var email = result.id;
                        }

                        // RUN AJAX
                        $.ajax({
                            url: localStorage.server + "/user_facebook.php",
                            data: {
                                user_fb: result.id,
                                user_fb_token: localStorage.fb_token,
                                user_fb_pic: result.picture.data.url,
                                user_pass: localStorage.fb_token,
                                user_email: email,
                                user_gender: result.gender,
                                user_name: result.first_name+" "+result.last_name
                            },
                            type: 'GET',
                            dataType: 'jsonp',
                            jsonp: 'callback',
                            timeout: localStorage.timeout
                        })
                                .always(function () {
                                    //myApp.hideIndicator();
                                })

                                .fail(function () {

                                  alert("Ocorreu um erro ao cadastrar sua conta com o facebook.");
                                  return;

                                })

                                .done(function (res) {

                                    if (res !== null) {

                                        if (res.error) {
                                            alert(res.error);
                                            return;
                                        }
                                        if (res.id > 0) {
                                            localStorage.fb_id = result.id;
                                            localStorage.user_id = res.id;
                                            localStorage.user_email = email;
                                            localStorage.user_pass = localStorage.fb_token;
                                            window.location.href = "index.html";
                                        }

                                    } // res not null
                                }); // after ajax


                    },
                    function (error) {
                        alert("/me failed = " + JSON.stringify(error));
                        //myApp.hideIndicator();
                    });
            //
        }, function (err) {
            //alert('an error occured while trying to login. please try again. Err: ' + JSON.stringify(err));
            //myApp.hideIndicator();
            if (typeof localStorage.fb_id !== "undefined") {
                
            }
        });
    },
    /*,
     getUserInfo: function () {
     //facebookConnectPlugin.api(localStorage.fb_id + "/?fields=id,email,first_name,last_name,gender,picture,birthday", ["public_profile", "user_birthday"],
     facebookConnectPlugin.api("/me", ["public_profile"],
     function (result) {
     alert("fb.getUserInfo() = " + JSON.stringify(result));
     localStorage.fb_id = result.id;
     localStorage.fb_first_name = result.first_name;
     localStorage.fb_last_name = result.last_name;
     localStorage.fb_gender = result.gender;
     localStorage.fb_email = result.email;
     localStorage.fb_birthday = result.birthday;
     //alert(localStorage.fb_email);
     },
     function (error) {
     alert("Failed: " + error);
     });
     },

     getLoginStatusX: function () {

     facebookConnectPlugin.getLoginStatus(
     function (response) {

     alert("fb.getLoginStatusX() = " + JSON.stringify(response));
     localStorage.fb_status = response.status;
     if (response.status === 'connected') {
     var uid = response.authResponse.userID;
     var accessToken = response.authResponse.accessToken;
     localStorage.fb_id = result.authResponse.userID;
     localStorage.fb_token = result.authResponse.accessToken;
     alert("AUTH OK");
     //return "OK MESMO";
     } else if (response.status === 'not_authorized') {
     alert("NOT AUTH");
     } else {
     alert("NOG LOGGED");
     }
     },
     function (error) {
     alert("Failed: " + error);
     });

     },
     getLoginStatus: function () {

     facebookConnectPlugin.getLoginStatus(function (response) {

     //alert("fb.getLoginStatus() = ");
     localStorage.fb_status = response.status;

     if (response.status === 'connected') {
     var uid = response.authResponse.userID;
     var accessToken = response.authResponse.accessToken;
     localStorage.fb_id = result.authResponse.userID;
     localStorage.fb_token = result.authResponse.accessToken;
     alert("AUTH OK");
     //return "OK MESMO";
     } else if (response.status === 'not_authorized') {
     alert("NOT AUTH");
     } else {
     alert("NOG LOGGED");
     }
     });
     }*/
    logout: function () {
        facebookConnectPlugin.logout(
                function () {
                    localStorage.removeItem("user_id");
                    window.location.href = "index.html";
                },
                function () {
                    //alert("logout error");
                });
    }

};
