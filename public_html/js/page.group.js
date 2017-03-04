function groupChatList() {
    //
    debug();
    //
    dbx('SELECT * FROM g LEFT JOIN g_chat ON g_chat.chat_id_group=g.group_id GROUP BY g.id ORDER BY g_chat.id DESC', function (transaction, result) {

        if (result.rows.length > 0) {
            $('#groupNone').hide();
        }
        //console.log("GROUP CHAT LIST RESULT:");
        //console.log(result);
        //return false;

        // FIX FIELDS FOR IPHONE
        var res = [];
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            res[i] = {
                group_id: row['group_id'],
                group_img: row['group_img'],
                group_title: row['group_title'],
                group_date: row['group_date'],
                //
                chat_id: row['chat_id'],
                chat_from: row['chat_from'],
                chat_id_group: row['chat_id_group'],
                chat_msg: row['chat_msg']
            };
        }
        // construct
        var x = 0;
        var html = '';
        var url, nome;
        $.each(res, function (i, item) {
            var rs = res[i];
            console.log(rs);
            if (rs.group_img !== "null") {
                url = "img/group.png";
            }
            else {
                url = "img/group.png";
            }
            if (rs.chat_msg === null || rs.chat_msg == "") {
                rs.chat_msg = "<span style='color:#ccc'>(Nenhuma mensagem)</span>";
            }
            //
            html += '<li class="showGroup swipeout" data-id="' + rs.group_id + '" data-name="' + rs.group_title + '" data-img="' + rs.group_img + '" data-date="' + rs.group_date + '">'; // row
            html += '<div class="swipeout-content">';
            html += '<a href="#" class="item-link item-content">';
            html += '<div class="item-media">';
            html += '<img src="' + url + '" style="width:42px !important;height:42px !important"/>';
            html += '</div>';
            html += '<div class="item-inner">';
            html += '<div class="item-title-row">';
            html += '<div class="item-title">' + rs.group_title + '</div>';
            html += '<div class="item-after">';
            //html += '<div class="chip" style="margin-top:-5px;background:#0288d1;color:#fff;font-size:12px;font-weight:100">';
            //html += '<div class="chip-label">5</div>';
            //html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '<div class="item-text" style="font-weight:100">' + rs.chat_msg + '</div>';
            html += '</div>';
            html += '</a>';
            html += '</div>';
            //html += '<div class="swipeout-actions-left"><a href="#" class="bg-green swipeout-overswipe demo-reply">Responder</a><a href="#" class="demo-forward bg-blue">Repray</a></div>';
            html += '<div class="swipeout-actions-right">';
            //html += '<a href="#" class="demo-actions">Mais</a><a href="#" class="demo-mark bg-orange">Fav</a>';
            html += '<a href="#" data-confirm="Are you sure you want to delete this item?" class="swipeout-delete swipeout-overswipe">Excluir</a>';
            html += '</div>';
            html += '</li>'; // row
            //sessionStorage.lastchat = rs.id; // last chat id
        });
        $('#getGroupList').html(html);
    });
}
function groupChatGet() {
    //
    debug();
    //
    if ($('.message').length === 0) {
        //myApp.showIndicator();
    }
    var qr = 'SELECT g.*,u.user_nick,u.user_id,u.user_fb,u.user_num FROM g_chat g LEFT JOIN user u ON g.chat_from=u.user_id WHERE g.chat_id_group = ' + sessionStorage.chatId + ' AND g.id > ' + localStorage.LAST_CHAT_ID_ACTIVE + ' AND g.chat_id IS NOT NULL AND g.chat_id <> "undefined" ORDER BY g.id ASC';
    dbx(qr, function (transaction, result) {

        // Init App
        var myApp = new Framework7();
        var myMessages = myApp.messages('.messages');
        var myMessagebar = myApp.messagebar('.messagebar');

        // FIX FIELDS FOR IPHONE
        var res = [];
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            res[i] = {
                id: row['id'], // id from local
                chat_id: row['chat_id'], // id from server
                chat_from: row['chat_from'],
                chat_id_group: row['chat_id_group'],
                chat_msg: row['chat_msg'],
                chat_date: row['chat_date'],
                // user data
                user_nick: row['user_nick'],
                user_id: row['user_id'],
                user_num: row['user_num'],
                user_fb: row['user_fb']
            };
            localStorage.LAST_CHAT_ID_ACTIVE = res[i]['id'];
        }
        console.log("get group results:" + result.rows.length + " last:" + localStorage.LAST_CHAT_ID_ACTIVE + "(id_local)");
        // construct
        $.each(res, function (i, item) {
            var rs = res[i];
            // from me (sent)
            if (rs.chat_from == localStorage.userId) {
                var myPic;
                if (typeof localStorage.fb_id === "undefined")
                    myPic = "";
                else
                    myPic = 'http://graph.facebook.com/' + localStorage.fb_id + '/picture?type=square';
                //console.log("MSG1X=" + rs.chat_msg + " " + myPic + "AAA");
                myMessages.addMessage({
                    text: rs.chat_msg,
                    avatar: myPic,
                    type: 'sent',
                    date: rs.chat_date
                            //date: dateFormat(new Date(rs.chat_date), "dd/mm hh:MM")
                });
                //console.log("aaa");
            }
            else {
                //console.log("MSG2=" + rs.chat_msg);
                var dstPic;
                if (rs.user_fb === "null")
                    dstPic = "";
                else
                    dstPic = 'http://graph.facebook.com/' + rs.user_fb + '/picture?type=square';
                myMessages.addMessage({
                    name: rs.user_nick,
                    text: rs.chat_msg,
                    avatar: dstPic,
                    type: 'received',
                    date: rs.chat_date
                            //date: dateFormat(new Date(rs.chat_date), "dd/mm hh:MM")
                });
            }
        });
    });

}
function groupCreateLocal(title, idReceivedFromServer, afterCreate) {
    //==========================
    // INSERT GROUP ON LOCAL DB
    //==========================
    var now = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
    var key = "", val = "";
    key += "group_title,group_date,group_id";
    val += '"' + title + '",';
    val += '"' + now + '",';
    val += '"' + idReceivedFromServer + '"';
    db.transaction(
            function (transaction) {
                transaction.executeSql(
                        'INSERT INTO g (' + key + ') VALUES (' + val + ')',
                        null,
                        function (transaction, result) {
                            var id_group = result.insertId; // id local group
                            if (afterCreate === "join_people") {
                                localStorage.ID_GROUP_JOIN = idReceivedFromServer;
                                groupChatList();
                                joinPopup();
                            }
                        },
                        errorHandler);
            }
    ); // transaction
}
function groupCreate(title) {

    //==========================
    // CREATE GROUP ON SERVER
    //==========================
    $.ajax({
        url: localStorage.server + "/groupCreate.json.php",
        data: {
            'id_user': localStorage.userId,
            'title': title
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
    })
            .always(function () {
                //myApp.hideIndicator();
            })

            .fail(function () {
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.', 'Erro');
                        return;
                    }
                    groupCreateLocal(title, res.success, "join_people");

                } // res not null
            }); // after ajax

}
function groupJoin(id_group, id_user_to_join, id_user) {
    myApp.showIndicator();
    //==========================
    // JOIN USER ON GROUP (SERVER)
    //==========================
    $.ajax({
        url: localStorage.server + "/groupJoin.json.php",
        data: {
            'id_user': id_user,
            'id_user_to_join': id_user_to_join,
            'id_group': id_group
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
    })
            .always(function () {
                myApp.hideIndicator();
            })

            .fail(function () {
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.', 'Erro');
                        return;
                    }
                    $('#joinPopup .join[data-id=' + id_user_to_join + ']').fadeOut("fast");
                    // não precisa dizer ao local agora quem são os participantes do grupo,
                    // buscar via ajax quando houver esta consulta
                    //groupJoinLocal(id_group, id_user_to_join, id_user);

                } // res not null
            }); // after ajax

}
function joinPopup() {
    var myApp = new Framework7({modalTitle: 'AdsApp'});
    myApp.popup('#joinPopup');
    $("#joinList").html("");
    $("#contacts").clone().appendTo("#joinList");
    $('#joinList .showChat').removeClass("showChat").addClass("join");
    $('#joinPopup .join[data-id=' + localStorage.userId + ']').hide();
    $('#joinList .join').find("a").attr("href", "#");
}
function groupChatInsert(src, id_group, messageText, idReceivedFromServer) {
    //
    this.scope = [src, id_group, messageText, idReceivedFromServer];
    debug(this);
    // RECEBI MENSAGEM DO SERVIDOR, E A MENSAGEM É MINHA, IGNORÁ-LA
    if (src === localStorage.userId && typeof idReceivedFromServer !== "undefined") {
        return false;
    }
    //==========================
    // INSERT MSG ON LOCAL DB
    //==========================
    var now = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
    var key = "", val = "";
    key += "chat_from,chat_id_group,chat_msg,chat_date,chat_id";
    val += '"' + src + '",';
    val += '"' + id_group + '",';
    val += '"' + messageText + '",';
    val += '"' + now + '",';
    val += '"' + idReceivedFromServer + '"';
    db.transaction(
            function (transaction) {
                transaction.executeSql(
                        'INSERT INTO g_chat (' + key + ') VALUES (' + val + ')',
                        null,
                        function (transaction, result) {
                            var id_local = result.insertId;
                            // SEND DATA TO SERVER
                            if (typeof idReceivedFromServer === "undefined") {
                                groupChatSend(src, id_group, messageText, id_local);
                            }
                            else {
                                // já insere isso em getajax()
                                //localStorage.LAST_CHAT_ID = idReceivedFromServer;
                            }

                        });
            }
    ); // transaction
}
function groupChatInsert_(res) {
    //
    debug();
    // RECEBI MENSAGEM DO SERVIDOR, E A MENSAGEM É MINHA, IGNORÁ-LA
    if (res.id_user_src === localStorage.userId && typeof res.id !== "undefined" && typeof res.action === "undefined") {
        //return false;
    }
    //==========================
    // INSERT MSG ON LOCAL DB
    //==========================
    var now = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
    var key = "", val = "";
    key += "chat_from,chat_to,chat_id_group,chat_msg,chat_action,chat_action_value,chat_post,chat_date,chat_id";
    val += '"' + res.id_user_src + '",';
    val += '"' + res.id_user_dst + '",';
    val += '"' + res.id_group + '",';
    val += '"' + res.msg + '",';
    val += '"' + res.action + '",';
    val += '"' + res.action_value + '",';
    val += '"' + res.id_post + '",';
    val += '"' + now + '",';
    val += '"' + res.id + '"';
    val = clearNull(val);
    var query = 'INSERT INTO g_chat (' + key + ') VALUES (' + val + ')';
    console.log(query);
    db.transaction(
            function (transaction) {
                transaction.executeSql(
                        query,
                        null,
                        function (transaction, result) {
                            var id_local = result.insertId;
                            // SEND DATA TO SERVER
                            if (typeof res.id === "undefined") {
                                groupChatSend(res.id_user_src, res.id_group, res.id_msg, id_local);
                            }
                        },
                        errorHandler);
            }
    ); // transaction
}
function groupChatSend(src, id_group, messageText, id_local) {
    //==========================
    // SEND MSG TO SERVER DB
    //==========================
    $.ajax({
        url: localStorage.server + "/groupChatSend.json.php",
        data: {
            'id_user_src': src,
            'id_group': id_group,
            'msg': messageText
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
    })
            .always(function () {
                //myApp.hideIndicator();
            })

            .fail(function () {
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.', 'Erro');
                        return;
                    }
                    localStorage.LAST_CHAT_ID_ACTIVE = id_local;
                    localStorage.LAST_GCHAT_ID = res.success;
                    //console.log("msg server id:" + res.success);
                    dbQuery('UPDATE g_chat SET chat_id="' + res.success + '" WHERE id="' + id_local + '"');

                } // res not null
            }); // after ajax

}
//#############################################
// INSERIR USUÁRIOS DO GRUPO EM MEUS CONTATOS
//#############################################
function groupUsers(id_group) {
    $.ajax({
        url: localStorage.server + "/groupUsers.json.php",
        data: {
            'id_user': localStorage.userId,
            'id_group': id_group
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
    })
            .always(function () {
                //myApp.hideIndicator();
            })

            .fail(function () {
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.', 'Erro');
                        return;
                    }
                    $.each(res, function (i, item) {
                        contactSave(res[i].userId, res[i].nick, res[i].num, res[i].id_fb);
                    });
                } // res not null
            }); // after ajax
}
//
$$(document).on('click', '.showGroup', function (e) {
    //return false;
    localStorage.LAST_CHAT_ID_ACTIVE = 0;
    sessionStorage.chatType = "group";
    sessionStorage.chatId = $(this).attr("data-id");
    sessionStorage.chatNum = $(this).attr("data-num");
    sessionStorage.chatName = $(this).attr("data-name");
    sessionStorage.chatFbLink = $(this).attr("data-img");
    if (sessionStorage.chatFbLink === "null") {
        sessionStorage.chatFbLink = "img/group.png";
    }
    groupUsers(sessionStorage.chatId); // add all users of the group on my contact list
    view1.router.loadPage('chat.html', {ignoreCache: true});
});
$$(document).on('click', '.join', function (e) {
    var id_user_to_join = $(this).attr("data-id");
    groupJoin(localStorage.ID_GROUP_JOIN, id_user_to_join, localStorage.userId);
});
$$('.groupCreate').on('click', function () {
    myApp.prompt('Qual o nome do novo grupo?', function (data) {
        if (data.length > 3) {
            groupCreate(data);
        }
        /*
         // @data contains input value
         myApp.confirm('Are you sure that your name is ' + data + '?', function () {
         myApp.alert('Ok, your name is ' + data + ' ;)');
         });
         */
    });
});