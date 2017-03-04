//=============================
// PAGE: *
//=============================
$$(document).on('click', '.post_read', function (e) {
//myApp.showTab('#view-1');
    var post_id = $(this).attr("data-id");
    sessionStorage.post_id = post_id;
    go("post_read.html");
});
//=============================
// PAGE: POST_FORM
//=============================
$$(document).on('click', '#removeLastImg', function (e) {
    if (sessionStorage.edit_id > 0) {
    }
    else {
        myApp.confirm('Tem certeza disto?', 'Desfazer envio', function () {
            removeLastImg();
            //view1.router.back();

        });
    }
});
myApp.onPageInit('post_form', function (page) {
    sessionStorage.serialize = $("#post_form form").serialize();
    // EDITAR POST
    if (sessionStorage.edit_id > 0) {
        var post_id = sessionStorage.edit_id;
        sessionStorage.edit_id = 0;
        postRead(post_id, postEditCb);
    }
    // NOVO POST
    else {
        // img
        var url = localStorage.server + localStorage.server_img + "/" + sessionStorage.img_last;
        console.log(url);
        $("#img_last").attr("src", url);
        $("[name=img_fn]").val(sessionStorage.img_last);
    }
    // VALIDATE
    $("#postForm").validate({
        rules: {
            post_name: {
                required: true,
                minlength: 3
            },
            post_phone: {
                required: true
            },
            categ_id: {
                required: true
            }
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });
});
$$(document).on('click', '.postSend', function (e) {
    if ($("#postForm").valid()) {
        postSend();
    }
    else {
        myApp.alert('Preencha corretamente os campos do formulário.', 'Ops!');
    }
});
$$(document).on('click', '#postCategEdit', function (e) {
    $(".catTxt").hide();
    $(".cat1").show();
});
//=============================
// PAGE: POST_READ
//=============================
myApp.onPageBeforeInit('post_read', function (page) {
    postRead(sessionStorage.post_id, postReadCb);
});
$$(document).on('click', '.post_edit', function (e) {
    sessionStorage.edit_id = sessionStorage.post_id;
    go("post_form.html");
    //view4.router.loadPage("post_read.html", {ignoreCache: true});
});
$$(document).on('click', '.post_del', function (e) {
    myApp.confirm('Tem certeza disto?', 'Excluir anúncio', function () {
        postDel(sessionStorage.post_id);
    });
});
//=============================
// GET POST DATA
//=============================
function postRead(post_id, cb) {

    myApp.showPreloader();
    $.ajax({
        url: localStorage.server + "/post_read.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            post_id: post_id
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
                cb(res);
            }); // after ajax
}
function postReadCb(res) {

    var post = res["post"];
    console.log(post);
    if (res === null || res.fail || res.error) {
        myApp.alert("Verifique sua conexão e tente novamente.");
        window.location.href = "index.html";
        return;
    }

    // COUNTS...
    var view = post[0]["post_count_view"];
    if (view == null)
        view = 0;
    var com = post[0]["post_count_com"];
    if (com == null)
        com = 0;
    var like = post[0]["post_count_like"];
    if (like == null)
        like = 0;
    // IMG
    var img_fn = post[0]["img_fn"];
    if (img_fn != null) {
        var url = localStorage.server + localStorage.server_img + img_fn;
        console.log(url);
        $("#post_read .img_fn").attr("src", url);
    }
    if (post[0]["user_fb_pic"] != null) {
        $("#post_read .user_fb_pic").attr("src", post[0]["user_fb_pic"]);
    }

    // CHAT FILL
    $("#post_read .chat").attr("data-id", post[0]["user_id"]);
    $("#post_read .chat").attr("data-name", post[0]["user_name"]);
    $("#post_read .chat").attr("data-pic", post[0]["user_fb_pic"]);
    // FILL
    $("#post_read .user_read").attr("data-id", post[0]["user_id"]);
    $("#post_read .post_view").html(view);
    $("#post_read .post_com").html(com);
    $("#post_read .post_like").html(like);
    $("#post_read .post_name").html(post[0]["post_name"]);
    $("#post_read .user_name").html(post[0]["user_name"]);
    $("#post_read .post_date").html(post[0]["post_date"]);
    $("#post_read .user_phone").attr("href", "tel:0" + post[0]["user_phone"]);
    $("#post_read .post_price").html(post[0]["post_price"]);
    pretty();
    var txt = post[0]["post_txt"];
    if (txt !== null) {
        $("#post_read .post_txt").html(txt);
    }
    if (post[0]["like_id"] > 0) {
        $("#post_read .post_like").css("color", "blue");
        $("#post_read .post_like_txt").css("color", "blue").html("Curtiu");
    }
// MOSTRAR OPÇÕES DE EDITAR
    if (post[0]["user_id"] == localStorage.user_id) {
        $("#post_read .edit").show();
    }
}
function postEditCb(res) {
    res.post[0]["post_txt"] = res.post[0]["post_txt_rn"];
    FF(res.post, "#post_form");
    //
    var url = localStorage.server + localStorage.server_img + res["post"][0]["img_fn"];
    $("#img_last").attr("src", url);
    $("#postTitle").html("Editar Anúncio");
    $("#postSend").html("Salvar Alterações");
    // categoria em texto vs categoria select
    $(".catTxt").show();
    $(".cat1").hide();
    var cat1, cat2, cat3;
    cat1 = cat2 = cat3 = "";
    cat1 = res["post"][0]["cat1"];
    if (res["post"][0]["cat2"]) {
        cat2 = ", " + res["post"][0]["cat2"];
    }
    if (res["post"][0]["cat3"]) {
        cat3 = ", " + res["post"][0]["cat3"];
    }
    $("#postCateg").html(cat1 + "" + cat2 + "" + cat3);
}
function postList(last_id, op, followers) {

    var prefix;
    // POST GERAL
    if (typeof followers === "undefined") {
        prefix = "post2";
        if (op === "new") {
            sessionStorage.post_id_list_new = last_id;
        }
        else {
            op = "";
            sessionStorage.post_id_list = last_id;
        }
    }
    // POST FOLLOWER
    else {
        prefix = "post"; // #post2_template, #post2_list, etc...
        if (op === "new") {
            sessionStorage.post2_id_list_new = last_id;
        }
        else {
            op = "";
            sessionStorage.post2_id_list = last_id;
        }
    }

    //$("#" + prefix + "_infinite").show();

    $.ajax({
        url: localStorage.server + "/post_list.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            last_id: last_id,
            op: op,
            followers: followers
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                $("#" + prefix + "_infinite").fadeOut("slow");

            })

            .fail(function () {
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {

                    console.log(res);
                    if (res === false) {
                        $("#post_none").fadeIn("slow");
                        return;
                    }
                    if (res.error) {
                        return;
                    }
                    var i = 0;
                    $.each(res, function (key, val) {
                        i++;
                        // PREPEND
                        if (op === "new") {
                            $("#" + prefix + "_template")
                                    .clone()
                                    .prop({
                                        id: prefix + "_" + val["post_id"]
                                    })
                                    .prependTo("#" + prefix + "_list")
                                    .attr("data-id", val["post_id"]);
                        }
                        // APPEND
                        else {
                            $("#" + prefix + "_template")
                                    .clone()
                                    .prop({
                                        id: prefix + "_" + val["post_id"]
                                    })
                                    .appendTo("#" + prefix + "_list")
                                    .attr("data-id", val["post_id"]);
                        }
                        $("#" + prefix + "_" + val["post_id"]).each(function (index) {

                            if (val["img_fn"] != null) {
                                $(this).find(".thumb").attr("src", localStorage.server + localStorage.server_img + "thumb_" + val["img_fn"]);
                                $(this).find(".post_img").attr("src", localStorage.server + localStorage.server_img + val["img_fn"]);

                            }
                            if (val["user_fb_pic"] != null) {
                                $(this).find(".user_fb_pic").attr("src", val["user_fb_pic"]);
                            }
                            $(this).find(".post_name").html(val["post_name"]);
                            if (val["post_price"] !== null) {
                                $(this).find(".post_price").html("R$ " + val["post_price"]);
                            }
                            if (val["user_bio"] !== null) {
                                $(this).find(".user_bio").html(val["user_bio"]);
                            }
                            // share
                            $(this).find(".share").attr("data-message", val["post_name"] + " por R$ " + val["post_price"]);
                            $(this).find(".share").attr("data-img", localStorage.server + localStorage.server_img + val["img_fn"]);
                            // content
                            $(this).find(".user_read").attr("data-id", val["user_id"]);
                            $(this).find(".post_read").attr("data-id", val["post_id"]);
                            $(this).find(".user_name").html(val["user_name"]);
                            $(this).find(".post_date").html(val["post_date"]);
                            $(this).find(".post_txt").html(val["post_txt"]);
                            $(this).find(".post_txt").text(function (index, currentText) {
                                if (currentText.length > 64) {
                                    return currentText.substr(0, 128) + " ...";
                                }
                            });
                            // chat
                            $(this).find(".chat").attr("data-id", val["user_id"]);
                            $(this).find(".chat").attr("data-name", val["user_name"]);
                            // tel
                            $(".user_phone").attr("href", "tel:0" + val["user_phone"]);

                        }).show();
                        //======================
                        // ULTIMO ID RECEBIDO
                        //======================
                        // POST GERAL
                        //======================
                        if (typeof followers === "undefined") {
                            if (op === "new") {
                                sessionStorage.post_id_list_new = val["post_id"];
                            }
                            else {
                                sessionStorage.post_id_list = val["post_id"];
                            }
                            if (last_id === 0) {
                                sessionStorage.post_id_list = val["post_id"];
                                if (i === 1)
                                    sessionStorage.post_id_list_new = val["post_id"];
                            }
                            console.log("(NEW) post_id = " + sessionStorage.post_id_list_new + " (OLD) post_id = " + sessionStorage.post_id_list);
                        }
                        //======================
                        // POST FOLLOWER
                        //======================
                        else {
                            if (op === "new") {
                                sessionStorage.post2_id_list_new = val["post_id"];
                            }
                            else {
                                sessionStorage.post2_id_list = val["post_id"];
                            }
                            if (last_id === 0) {
                                sessionStorage.post2_id_list = val["post_id"];
                                if (i === 1)
                                    sessionStorage.post2_id_list_new = val["post_id"];
                            }
                            console.log("(NEW) post2_id = " + sessionStorage.post2_id_list_new + " (OLD) post2_id = " + sessionStorage.post2_id_list);
                        }
                        pretty();
                        setTimeout(function () {
                            if ($('#post_list').children().length > 0) {
                                $("#post_none").hide();
                            }
                        }, 500);
                    });
                } // res not null
                else {
                    alert("Erro interno.");
                }

            }); // after ajax
}
function postListGrid(last_id, op) {

    console.log("postListGrid...");

    var prefix = "post2";
    // POST GERAL
    if (op === "new") {
        sessionStorage.post_id_list_new = last_id;
    }
    else {
        op = "";
        sessionStorage.post_id_list = last_id;
    }

    $.ajax({
        url: localStorage.server + "/post_list.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            last_id: last_id,
            op: op
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                $("#" + prefix + "_infinite").fadeOut("slow");
                myApp.hideIndicator();
                console.log("end postListGrid");
            })

            .fail(function () {
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {

                    console.log(res);
                    if (res === false) {
                        return;
                    }
                    if (res.error) {
                        return;
                    }
                    var i = 0;
                    //var $grid = $("#" + prefix + "_list");
                    $.each(res, function (key, val) {
                        i++;
                        // create new item elements
                        var item = '';
                        item += '<div class="square">';
                        item += '<div class="content">';
                        item += '<div class="table">';
                        item += '<div class="post_read table-cell" data-id="' + val["post_id"] + '" style="background-image:url(' + localStorage.server + localStorage.server_img + "thumb_" + val["img_fn"] + ')">';
                        //item += '<img class="rs" src="'+localStorage.server+localStorage.server_img+val["img_fn"]+'" />';
                        //item += 'Responsive image.';
                        item += '</div>';
                        item += '</div>';
                        item += '</div>';
                        item += '</div>';
                        //console.log(item);

                        // PREPEND
                        if (op === "new") {

                        }
                        // APPEND
                        else {
                            $("#" + prefix + "_list").append(item);
                        }

                        //======================
                        // ULTIMO ID RECEBIDO
                        //======================
                        // POST GERAL
                        //======================
                        if (op === "new") {
                            sessionStorage.post_id_list_new = val["post_id"];
                        }
                        else {
                            sessionStorage.post_id_list = val["post_id"];
                        }
                        if (last_id === 0) {
                            sessionStorage.post_id_list = val["post_id"];
                            if (i === 1)
                                sessionStorage.post_id_list_new = val["post_id"];
                        }

                    });
                    console.log("(NEW/GRID) post_id = " + sessionStorage.post_id_list_new + " (OLD) post_id = " + sessionStorage.post_id_list);

                } // res not null
                else {
                    alert("Erro interno.");
                }
                if (sessionStorage.post2_id_list == 0) {
                    $("#post_none").fadeIn("slow");
                }

            }); // after ajax
}
// CEHCK LAST IMG
function postStart(id) {

    if (typeof id !== "undefined") {
        sessionStorage.img_last = res[0]["img_fn"];
        go("post_form.html");
        return;
    }

    $.ajax({
        url: localStorage.server + "/img_last.php",
        data: {
            'user_id': localStorage.user_id,
            'user_email': localStorage.user_email,
            'user_pass': localStorage.user_pass
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.hidePreloader();
                userAds(localStorage.user_id, userAdsCb_Me);
            })

            .fail(function () {
                myApp.alert("Falha na conexão.", "Ops!")
            })

            .done(function (res) {

                //console.log("iframe.loaded. result:");
                console.log(res);

                if (res !== null) {

                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno. ' + res.error, 'Erro');
                        return;
                    }

                    if (res !== false) {
                        sessionStorage.img_last = res[0]["img_fn"];
                        go("post_form.html");
                    }
                } // res not null
            }); // after ajax
}
//=============================
// GRID MASONRY
//=============================
function postGrid() {
}
//=============================
// INSERT / DELETE POST
//=============================
function postSend() {
    var data_form = $("#post_form form").serialize();
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
        url: localStorage.server + "/post_insert.php",
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
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);
                    if (res.error) {
                        //myApp.alert('Desculpe, ocorreu um erro interno.', 'Erro');
                        alert(res.error);
                        return;
                    }
                    if (res.success) {
                        sessionStorage.post_id = res.success;
                        window.location.href = "index.html";
                    }
                } // res not null
            }); // after ajax
}
function postDel(post_id) {

    myApp.showPreloader();
    $.ajax({
        url: localStorage.server + "/post_del.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            post_id: post_id
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
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })
            .done(function (res) {
                window.location.href = "index.html";
            });
}
function removeLastImg() {
    myApp.showPreloader();
    $.ajax({
        url: localStorage.server + "/img_del.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                window.location.href = "index.html";
            })
            .fail(function () {
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })
            .done(function (res) {
                //window.location.href = "index.html";
            });
}
//=============================
// GET CATEG LIST
//=============================
$$(document).on('change', '.cat', function (e) {
    var id = $(this).val();
    catChange(id);
});
function postCat(cb) {
    $.ajax({
        url: localStorage.server + "/categ_list.php",
        data: {
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                //preloader(false);
            })

            .fail(function () {
                //preloader(false);
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    if (res.error) {
                        return;
                    }
                    $.each(res, function (key, val) {
                        sessionStorage.setItem("cName_" + val["categ_id"], val["categ_name"]);
                        sessionStorage.setItem("cLevel_" + val["categ_id"], val["categ_level"]);
                        sessionStorage.setItem("cParent_" + val["categ_id"], val["categ_parent"]);
                    });
                    cb();
                }
                console.log("cat");
                console.log(sessionStorage);
            }); // after ajax
}
//======================================
// LOAD CATEG LEVEL 1
//======================================
function postCatCb() {
    var html = "";
    html += "<option value=''>Selecione...</option>\r\n";
    $.each(sessionStorage, function (key, val) {
        if (key.startsWith("cName_")) {
            var id = key.split("_");
            if (sessionStorage.getItem("cParent_" + id[1]) == "") {
                html += "<option value='" + id[1] + "'>" + val + "</option>\r\n";
            }
        }
    });
    $("#cat1").html(html);
    $(".cats").hide();
}
//======================================
// LOAD CATEG LEVEL 2/3
//======================================
function catChange(id) {
    var level = sessionStorage.getItem("cLevel_" + id);
    var next_level = parseInt(level) + 1;
    var find = 0;
    var html = "";
    html += "<option value=''>Selecione...</option>\r\n";
    // TEM FILHO?
    $.each(sessionStorage, function (key, val) {
        if (key.startsWith("cParent_")) {
            if (val == id) {
                find++;
                var child = key.split("_");
                var name = sessionStorage.getItem("cName_" + child[1]);
                html += "<option value='" + child[1] + "'>" + name + "</option>\r\n";
            }
        }
    });
    $("#cat" + next_level).html(html);
    if (find > 0) {
        $(".cat" + next_level).fadeIn("fast");
    }
    else {
        $(".cat" + next_level).hide();
    }
}
//======================================
// PULL TO REFRESH
//======================================
$$('.pull-to-refresh-content').on('refresh', function (e) {
    // ALL POSTS
    if (sessionStorage.activePage === "index-2") {
        postListGrid(sessionStorage.post2_id_list_new, "new");
    }
    // POST FOLLOWERS
    else {
        postList(sessionStorage.post_id_list_new, "new", true); // followers
    }
    setTimeout(function () {
        myApp.pullToRefreshDone();
    }, 1000);
});
//======================================
// INFINITE SCROLL
//======================================
$$('.infinite-scroll').on('infinite', function () {
    // ALL POSTS
    if (sessionStorage.activePage === "index-2") {
        if ($("#post2_infinite").css("display") === "none") {
            $("#post2_infinite").fadeIn("slow", function () {
                postListGrid(sessionStorage.post_id_list);
            });
        }
    }
    // POST FOLLOWERS
    else {
        if ($("#post_infinite").css("display") === "none") {
            $("#post_infinite").fadeIn("slow", function () {
                postList(sessionStorage.post2_id_list, "", true);
            });
        }
    }
});
