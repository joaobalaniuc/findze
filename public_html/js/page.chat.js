//================================
// EVENTS ON PAGE: *
//================================
$$(document).on('click', '.chat', function (e) {
    //$("#chat").remove();
    sessionStorage.chat_user = $(this).attr("data-id");
    sessionStorage.chat_name = $(this).attr("data-name");
    var pic = $(this).attr("data-pic");
    if (typeof pic === "undefined") {
        pic = "img/user.png";
    }
    sessionStorage.chat_pic = pic;
    go("chat.html");
});
//================================
// PAGE: CHAT
//================================
myApp.onPageBeforeInit('chat', function (page) {
    sessionStorage.chat_loading = 1; // spinner
    sessionStorage.chat_id = 0;
    $("#chatName").html(sessionStorage.chat_name);
    $("#chatPic").attr("src", sessionStorage.chat_pic);
    $("#chat .user_read").attr("data-id", sessionStorage.chat_user);
    myMessages = myApp.messages('.messages');
    myMessagebar = myApp.messagebar('.messagebar');
});
myApp.onPageInit('chat', function (page) {
    chatRead();
});
$$(document).on('click', '#chatSend', function (e) {
    var chat_txt = $("#chatTxt").val();
    $("#chatTxt").val("");
    console.log(chat_txt);
    if (chat_txt === "") {
        return false;
    }
    chatSend(chat_txt);
});
$$(document).on('click', '.chat_del', function (e) {
  myApp.confirm('Are you sure?', function () {
          var id_other = $(this).attr("data-id-other");
          chatDel(id_other);
      });
});

//================================
// FUNCTIONS
//================================
function chatRead() {
    //
    var page = myApp.getCurrentView().activePage.name;
    if (page !== "chat") {
        return false;
    }
    //
    //if ($('.message').length === 0) {
    if (sessionStorage.chat_loading == 1) {
        sessionStorage.chat_loading = 0;
        myApp.showIndicator();
    }

    $.ajax({
        url: localStorage.server + "/chat_read.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            target_id: sessionStorage.chat_user,
            chat_id: sessionStorage.chat_id // last id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.hideIndicator();
                setTimeout(function () {
                    chatRead();
                }, 3000);
            })

            .fail(function () {
                alert("err");
            })

            .done(function (res) {
                console.log(res);
                if (res[0]) {
                    $.each(res, function (i, item) {

                        var rs = res[i];

                        // bugfix msg enviada proxima ao timer
                        if (rs.chat_id > parseInt(sessionStorage.chat_id)) {
                            // enviado
                            if (rs.chat_user_src === localStorage.user_id) {
                                var type = "sent";
                            }
                            // recebido
                            else {
                                var type = "received";
                            }
                            // mostrar
                            myMessages.addMessage({
                                text: rs.chat_txt,
                                //avatar: "img/user.png",
                                type: type,
                                date: dateFormat(new Date(rs.chat_date_src), "dd/mm hh:MM")
                                        //date: dateFormat(new Date(rs.chat_date), "dd/mm hh:MM")
                            });

                            /*
                             $("#" + type + "_template")
                             .clone()
                             .prop({
                             id: "msg_" + rs.chat_id
                             })
                             .appendTo("#msg");

                             $("#msg_" + rs.chat_id).each(function (index) {

                             $(this).find(".message-name").html(rs.user_name);
                             $(this).find(".message-text").html(rs.chat_txt);
                             $(this).find(".message-date").html(rs.chat_date);
                             }).show();
                             */

                            sessionStorage.chat_id = rs.chat_id;
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                    }); // each


                }
            }); // after ajax
}
function chatSend(chat_txt) {

    // show msg
    var today = new Date();
    myMessages.addMessage({
        text: chat_txt,
        //avatar: "img/user.png",
        type: "sent",
        date: dateFormat(new Date(today), "dd/mm hh:MM")
    });

    $.ajax({
        url: localStorage.server + "/chat_insert.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            chat_user_dst: sessionStorage.chat_user,
            chat_txt: chat_txt
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
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                console.log(res);
                if (res.success > 0) {
                    sessionStorage.chat_id = res.success;
                }
            }); // after ajax

}
function chatList(last_id) {

    if (sessionStorage.chat_list_loading == 0) {
        sessionStorage.chat_list_loading = 1;
        myApp.showIndicator();
    }

    $.ajax({
        url: localStorage.server + "/chat_list.php",
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
                myApp.hideIndicator();
                /*setTimeout(function () {
                 chatList(sessionStorage.chat_id_list);
                 }, 5000);*/
            })

            .fail(function () {

            })

            .done(function (res) {
                console.log(res);

                if (res[0]) {

                    $("#chat_list").html("");
                    $("#chat_none").hide();

                    // construct
                    var x = 0;
                    var html = '';
                    var other_id, pic, vc, name;

                    $.each(res, function (i, item) {

                        var rs = res[i];

                        sessionStorage.chat_id_list = rs.chat_id;

                        if (rs.chat_user_src === localStorage.user_id) {
                            pic = rs.dstPic;
                            vc = "<em>Você:</em> ";
                            name = rs.dstName;
                            other_id = rs.dstId;
                        }
                        else {
                            pic = rs.srcPic;
                            vc = "";
                            name = rs.srcName;
                            other_id = rs.srcId;
                        }
                        if (pic === null) {
                            pic = "img/user.png";
                        }

                        $("#chat_list_template")
                                .clone()
                                .prop({
                                    id: "chat_" + rs.chat_id
                                })
                                .attr("data-id-other", other_id)
                                .appendTo("#chat_list");

                        $("#chat_" + rs.chat_id).each(function (index) {

                            $(this).find(".chat")
                                .attr("href", "chat.html")
                                .attr("data-id", other_id)
                                .attr("data-name", name)
                                .attr("data-pic", pic);

                            $(this).find(".chat_del")
                                    .attr("data-id-other", other_id);

                            $(this).find(".user_pic").attr("src", pic);
                            $(this).find(".user_name").html(name);
                            $(this).find(".chat_txt").html(vc + rs.chat_txt);

                        }).show();

                    });

                }
                else {
                    $("#chat_none").show();
                }
            });
}
function chatDel(id_other) {

    console.log("id_other="+id_other);

    myApp.showIndicator();
    $.ajax({
        url: localStorage.server + "/chat_del.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            id_other: id_other
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
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })
            .done(function (res) {
                $("li[data-id-other="+id_other+"]").fadeOut("fast");
            });
}
