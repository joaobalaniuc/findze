//=============================
// PAGE: *
//=============================
$$(document).on('click', '.user_read', function (e) {
    //myApp.showTab('#view-1');
    //$("#user_read").remove();
    var friend_id = $(this).attr("data-id");
    sessionStorage.friend_id = friend_id;
    go("user_read.html");
});
//=============================
// PAGE: USER_READ
//=============================
myApp.onPageBeforeInit('user_read', function (page) {
    userRead(sessionStorage.friend_id, userReadCb_Friend);
    //$(".toolbar").hide();
});
//=============================
// PAGE: USER_FORM
//=============================
myApp.onPageBeforeInit('user_form', function (page) {
    userRead(localStorage.user_id, userReadCb_Form);
});
myApp.onPageInit('user_form', function (page) {
    setTimeout(function () {
        setMask();
    }, 500);
});
$$(document).on('click', '.userUpdate', function (e) {
    userUpdate();
});
$$(document).on('click', '.userLogout', function (e) {
    userLogout();
});
$$(document).on('click', '#user_read .userFollow', function (e) {
    userFollow(sessionStorage.friend_id);
});
//=============================
// PAGE: USER_LOGIN
//=============================
myApp.onPageInit("user_login", function (page) {

    $("#userLogin").validate({
        rules: {
            user_email: {
                required: true,
                minlength: 7
                        //email: true
            },
            user_pass: {
                required: true
            }
        },
        // For custom messages
        messages: {
            user_email: {
                required: "Digite seu e-mail",
                email: "Digite um e-mail válido",
                minlength: "Mínimo de 5 caracteres"
            },
            user_pass: "Digite sua senha"
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(element.parent());
            }
        },
        //errorLabelContainer: '.errorTxt'
    });
});
$$(document).on('click', "#userSubmitLogin", function (e) {
    e.preventDefault();
    if ($("#userLogin").valid()) {
        userLogin();
    }
});
//=============================
// PAGE: USER_REGISTER
//=============================
myApp.onPageInit("user_register", function (page) {

    setMask();

    $("#userSend").validate({
        rules: {
            user_name: {
                required: true,
                minlength: 3
            },
            user_email: {
                required: true,
                minlength: 7,
                email: true
            },
            user_pass: {
                required: true,
                minlength: 5
            },
            cpass: {
                required: true,
                minlength: 5,
                equalTo: "#user_pass"
            }
        },
        // For custom messages
        messages: {
            user_email: {
                required: "Digite seu e-mail",
                email: "Digite um e-mail válido",
                minlength: "Mínimo de 5 caracteres"
            },
            user_pass: "A senha deve ter no mínimo 5 caracteres",
            user_cpass: "As senhas não coincidem",
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(element.parent());
            }
        }
        //errorLabelContainer: '.errorTxt'
    });
});
$$(document).on('click', "#userSubmit", function (e) {
    e.preventDefault();
    if ($("#userSend").valid()) {
        userSend();
    }
});

//=============================
// GET DATA
//=============================
function userRead(target_id, cb) {

    // PRELOADER
    myApp.showPreloader();

    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/user_read.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            target_id: target_id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.hidePreloader();
            })

            .fail(function () {
                var r = {"fail": true};
                cb(r);
            })

            .done(function (res) {
                console.log(res);
                cb(res);
            });
}
function userReadCb_Form(res) {
    FF(res, "#userForm");
    /*$(".user_first_name").html(res[0].user_first_name);
     $(".user_email").html(res[0].user_email);
     
     var fb = res[0].user_fb_pic;
     if (fb != null) {
     //$(".avatar").attr("src", "http://graph.facebook.com/" + fb + "/picture?width=100&height=100");
     $(".avatar").attr("src", fb);
     $("#fb_ass").hide();
     $("#fb_des").show();
     }
     */
}
function userReadCb_Me(res) {

    if (res[0]) {

        console.log(res[0]);

        $("#index-4 .user_name").html(res[0]["user_name"]);
        $("#index-4 .user_fullname").html(res[0]["user_fullname"]);
        $("#index-4 .user_bio").html(res[0]["user_bio"]);
        $("#index-4 .user_followers").html(res[0]["user_count_followers"]);
        $("#index-4 .user_following").html(res[0]["user_count_following"]);
        String.prototype.splice = function (idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };
        if (res[0]["user_fb_pic"] !== null) {
            $("#index-4 .pic_img").attr("src", res[0]["user_fb_pic"]);
            $("#index-4 .pic_bg").css("background-image", "url(" + res[0]["user_fb_pic"] + ")");
            $("#index-4 .pic_img").css("width", "180px").css("height", "180px");//.css("margin", "32px");;
        }
        if (res[0]["user_phone"] == null) {
            var phone = "(sem telefone)";
        }
        else {
            var phone = "(" + res[0]["user_phone"].splice(2, 0, ") ");
            phone = phone.splice(10, 0, "-");
        }
        $("#index-4 .user_phone").html(phone);

    } // res[0]
}
function userReadCb_Friend(res) {

    if (res[0]) {
        // chat button
        $("#user_read .chat").attr("data-id", res[0]["user_id"]);
        $("#user_read .chat").attr("data-name", res[0]["user_name"]);
        $("#user_read .chat").attr("data-pic", res[0]["user_fb_pic"]);
        //
        $("#user_read .user_name").html(res[0]["user_name"]);
        $("#user_read .user_bio").html(res[0]["user_bio"]);
        String.prototype.splice = function (idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };
        if (res[0]["user_fb_pic"] !== null) {
            $("#user_read .pic_img").attr("src", res[0]["user_fb_pic"]);
            $("#user_read .pic_bg").css("background-image", "url(" + res[0]["user_fb_pic"] + ")");
            $("#user_read .pic_img").css("width", "180px").css("height", "180px");//.css("margin", "32px");;
        }
        if (res[0]["user_phone"] == null) {
            $("#user_read .user_phone").addClass("disabled");
        }
        else {
            var phone = "(" + res[0]["user_phone"].splice(2, 0, ") ");
            phone = phone.splice(10, 0, "-");
            $("#user_read .user_phone").attr("href", "tel:0" + res[0]["user_phone"]);
        }


        if (res[0]["follow_id"] > 0) {
            $("#seguir").hide();
            $("#deixar").show();
        }
        userAds(res[0]["user_id"], userAdsCb_Friend);

    } // res[0]

}
function userAds(user_id, cb) {
    //
    //myApp.showIndicator();
    $.ajax({
        url: localStorage.server + "/user_post.php",
        data: {
            'user_id': localStorage.user_id,
            'user_email': localStorage.user_email,
            'user_pass': localStorage.user_pass,
            //
            'target_id': user_id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 10000
    })
            .always(function () {
                //myApp.hideIndicator();
            })

            .fail(function () {
                var r = {"fail": true};
                cb(r);
            })

            .done(function (res) {
                cb(res);
            });
}
function userAdsCb_Me(res) {

    if (res !== null) {


        if (res.error) {
            myApp.alert('Desculpe, ocorreu um erro interno. ' + res.error, 'Erro');
            return;
        }

        if (res[0]) {
            $("#user_post").html("");
            $.each(res, function (key, val) {

                $("#user_post_template")
                        .clone()
                        .prop({
                            id: "user_post_" + val["post_id"]
                        })
                        .appendTo("#user_post")
                        .attr("data-id", val["post_id"]);


                $("#user_post_" + val["post_id"]).each(function (index) {

                    $(this).find(".post_name").html(val["post_name"]);
                    $(this).find(".post_price").html(val["post_price"]);
                    var url = localStorage.server + localStorage.server_img + "/" + val["img_fn"];
                    $(this).find(".img_fn").attr("src", url);
                }).show();
            });
        } // res[0]
        else {
            $("#user_post_none").show();
        }
    } // res not null
}
function userAdsCb_Friend(res) {
    console.log(res);

    if (res !== null) {

        if (res.error) {
            myApp.alert('Desculpe, ocorreu um erro interno. ' + res.error, 'Erro');
            return;
        }

        if (res[0]) {
            $("#friend_post").html("");
            $.each(res, function (key, val) {

                $("#friend_post_template")
                        .clone()
                        .prop({
                            id: "friend_post_" + val["post_id"]
                        })
                        .appendTo("#friend_post")
                        .attr("data-id", val["post_id"]);


                $("#friend_post_" + val["post_id"]).each(function (index) {

                    $(this).find(".post_name").html(val["post_name"]);
                    $(this).find(".post_price").html(val["post_price"]);
                    var url = localStorage.server + localStorage.server_img + "/" + val["img_fn"];
                    $(this).find(".img_fn").attr("src", url);
                }).show();
            });
        } // res[0]
    } // res not null
}

//=============================
// FOLLOW / UNFOLLOW
//=============================
function userFollow(target_id) {

    // PRELOADER
    myApp.showIndicator();

    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/user_follow.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            target_id: target_id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.hideIndicator();
            })

            .fail(function () {
                alert("fail");
            })

            .done(function (res) {

                console.log(res);
                if (res !== null) {

                    if (res.error) {
                        return;
                    }
                    if (res.success) {
                        // res.success = total de seguidores atual
                        // res.follow = 0(unfollow), 1(follow)
                        if (res.follow > 0) {
                            $("#deixar").show();
                            $("#seguir").hide();
                        }
                        else {
                            $("#deixar").hide();
                            $("#seguir").show();
                        }
                        //alert(1);
                        sessionStorage.refreshFollow = 1;
                    }


                } // res not null
            }); // after ajax
}
//=============================
// LOGIN / INSERT / UPDATE
//=============================
function userLogin() {

    // PRELOADER
    myApp.showPreloader();

    // DATA TO SEND
    var data_form = $("#userLogin").serialize();
    var data_user = {
        //user_email: "...",
        //query: "insert"
    };
    var data_user = $.param(data_user); // serialize
    var data = data_form + "&" + data_user;
    console.log(data);

    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/user_login.php",
        data: data,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.hidePreloader();
            })

            .fail(function () {
                myApp.alert('Desculpe, a conexão falhou. Tente novamente mais tarde.', 'Ops!');
            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);
                    if (res.error) {
                        myApp.alert(res.error, 'Ops!');
                        return;
                    }
                    if (res.id) {
                        localStorage.user_id = res.id;
                        localStorage.user_email = res.email;
                        localStorage.user_pass = res.pass;
                        window.location.href = "index.html";
                    }

                } // res not null
            }); // after ajax
}
function userSend() {
    // DATA TO SEND
    var data_form = $("#userSend").serialize();
    var data_user = {
        //
    };
    var data_user = $.param(data_user); // serialize
    var data = data_form + "&" + data_user;
    console.log(data);
    myApp.showPreloader();
    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/user_send.php",
        data: data,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.hidePreloader();
            })

            .fail(function () {
                myApp.alert('Desculpe, a conexão falhou. Tente novamente mais tarde.', 'Ops!');
            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);
                    if (res.error) {
                        myApp.alert(res.error, 'Ops!');
                        return;
                    }
                    if (res.id) {
                        localStorage.user_id = res.id;
                        localStorage.user_email = res.email;
                        localStorage.user_pass = res.pass;
                        window.location.href = "index.html";
                    }

                } // res not null
            }); // after ajax
}
function userUpdate() {
    // DATA TO SEND
    var data_form = $("#userForm").serialize();
    var data_user = {
        user_id: localStorage.user_id,
        user_email: localStorage.user_email,
        user_pass: localStorage.user_pass
    };
    var data_user = $.param(data_user); // serialize
    var data = data_form + "&" + data_user;
    console.log(data);

    // RUN AJAX
    myApp.showPreloader();
    $.ajax({
        url: localStorage.server + "/user_update.php",
        data: data,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.hidePreloader();
            })

            .fail(function () {
                myApp.alert('Desculpe, a conexão falhou. Tente novamente mais tarde.', 'Ops!');
            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);
                    if (res.error) {
                        alert("Erro: " + res.error);
                        return;
                    }
                    if (res.success) {
                        window.location.href = "index.html";
                    }

                } // res not null
            }); // after ajax
}
function userLogout() {
    myApp.confirm('Tem certeza disto?', 'Fazer logout', function () {
        localStorage.removeItem("user_id");
        setTimeout(function () {
            window.location.href = "index.html";
        }, 1000);
    });

}
