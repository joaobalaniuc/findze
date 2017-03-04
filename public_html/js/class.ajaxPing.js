function ajaxPing() {
    return false;
    //
    debug();
    //
    if (typeof localStorage.userId === "undefined") {
        return false;
    }
    // PRIMEIRA EXECUÇÃO, ENTÃO..
    // VARIAVEL AINDA NAO FOI SETADA EM CLASS.DB()
    if (localStorage.LAST_CHAT_ID < 0) {
        setTimeout(function () {
            ajaxPing();
        }, 3000);
        return false;
    }
    //console.log("searching chat id > " + localStorage.LAST_CHAT_ID);

    $.ajax({
        url: localStorage.server + "/ajaxPing.json.php",
        data: {
            'id_user': localStorage.userId,
            'id_chat': localStorage.LAST_CHAT_ID,
            'id_gchat': localStorage.LAST_GCHAT_ID
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
    })
            .always(function () {
                //s.removeItem(fN); // halt
                //myApp.hideIndicator();
                setTimeout(function () {
                    ajaxPing();
                }, 3000);
            })

            .fail(function () {
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    // PRIV8 CHAT
                    if (typeof res["chat"].length !== "undefined") {
                        console.log(res["chat"].length + " new chats received now");
                        console.log(res["chat"]);
                        localStorage.LAST_CHAT_ID = res["chat"][parseInt(res["chat"].length - 1)].id;
                    }
                    // GROUP CHAT
                    if (typeof res["gchat"].length !== "undefined") {
                        console.log(res["gchat"].length + " new g-chats received now");
                        //console.log(res["gchat"]);
                        localStorage.LAST_GCHAT_ID = res["gchat"][parseInt(res["gchat"].length - 1)].id;
                    }
                    // CONSTRUCT => PRIV8 CHAT
                    $.each(res["chat"], function (i, item) {
                        if (res["chat"][i].id !== localStorage.LAST_CHAT_ID_ACTIVE) {
                            chatInsert(res["chat"][i].id_user_src, res["chat"][i].id_user_dst, res["chat"][i].msg, res["chat"][i].id);
                        }
                    });
                    // CONSTRUCT => GROUP CHAT
                    $.each(res["gchat"], function (i, item) {
                        if (res["gchat"][i].id !== localStorage.LAST_GCHAT_ID_ACTIVE) {
                            //groupChatInsert(res["gchat"][i].id_user_src, res["gchat"][i].id_group, res["gchat"][i].msg, res["gchat"][i].id);
                            groupChatInsert_(res["gchat"][i]);
                            console.log(res["gchat"][i]);
                        }
                    });

                } // res not null
            }); // after ajax

}