function getContact() {
    var fields = ['displayName', 'name', 'phoneNumbers'];
    navigator.contacts.find(fields, onContactSuccess, onContactError, {filter: "", multiple: true});
}
function onContactSuccess(contacts) {

    var myArray = [];
    var contact_name;
    var contact_phone;
    var letter;
    for (i = 0; i < contacts.length; i++) {
        if (contacts[i].name.formatted != null && contacts[i].name.formatted != undefined) {
            contact_name = contacts[i].name.formatted;
            contact_name = contact_name.replace(/'/g, "''");

            if (contacts[i].phoneNumbers != null && contacts[i].phoneNumbers.length > 0 && contacts[i].phoneNumbers[0].value != null && contacts[i].phoneNumbers[0].value != undefined) {
                contact_phone = contacts[i].phoneNumbers[0].value;
                //console.log(contacts[i]);
                //console.log(contact_name + "=" + contact_phone + " / " + formatNum(contact_phone));

                myContacts.appendItem('<li data-id="' + contacts[i].id + '" data-num="' + contact_phone + '"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">' + contact_name + ' #' + contacts[i].id + '</div></div><div class="item-subtitle">' + contact_phone + '</div></div></a></li>');

                //var subtitle = "";
                dbx('SELECT * FROM contact WHERE num = "' + contact_phone + '"', function (transaction, result) {
                    //console.log(contact_phone + " = " + result.rows.length + " results ");

                    if (result.rows.length === 0) {
                        //subtitle = "(NOT USER)";
                    }
                    else {
                        //subtitle = " (ADSAPP USER)";
                    }
                });
            } else {
                //console.log("--No Number-");
                contact_phone = "";
            }
        }
    }

    checkContact(0);
    checkContactDb(0);

}
function onContactError(error) {
    alert(error);
}

//==============================================
// VERIFICAR SE CONTATO POSSUI ADSAPP
// DE ACORDO COM BD INTERNO
//==============================================
function checkContactDb(start) {
    var end = parseInt(start + 50);
    //console.log(start);
    $.each(myContacts.items, function (i, value) {
        //console.log(start);
        if (i >= start && i < end) {
            console.log("checkContactDb(): " + i);
            var num = $(value).attr("data-num");
            console.log("checkContactDb(): " + num);
            dbx('SELECT * FROM contact WHERE num_local = "' + num + '"', function (transaction, result) {
                if (result.rows.length > 0) {
                    $('li[data-num="' + num + '"] .item-subtitle').html("- ADSAPP USER(DB)=" + num);
                    console.log("found=" + num);
                }
                else {
                    $('li[data-num="' + num + '"] .item-subtitle').html('<a style="width:50%;ffloat:right;" href="#" class="button button-raised button-fill color-green">Convidar=' + num + '</a>');
                    //console.log("not found= " + enc(result));
                }
                //myContacts.update();
            });
        }
    });
    if (parseInt(end + 1) >= myContacts.items.length) {
        //console.log("end");
        end = 0; // start for timeout
    }
    setTimeout(function () {
        checkContactDb(end);
    }, 2000);

}

//==============================================
// VERIFICAR SE CONTATO POSSUI ADSAPP
// DE ACORDO COM SERVIDOR
//==============================================
function checkContact(num) {

    var numx = parseInt(num + 50);
    var x = "";
    $.each(myContacts.items, function (i) {
        if (i >= num && i < numx) {
            var item = myContacts.items[i];
            var n = $(item).attr("data-num");
            //n = formatNum(formatNum(n));
            x += n + ",";
            if (parseInt(i + 1) >= myContacts.items.length) {
                numx = 0;
            }
        }
    });
    console.log("checkContact(): " + numx + "/" + myContacts.items.length + "=" + x);
    $.ajax({
        url: localStorage.server + "/contact-check.json.php",
        data: {
            'num': x
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 7000
    })
            .always(function () {

                setTimeout(function () {
                    checkContact(numx);
                }, 1000);

            })

            .fail(function () {
                console.log("sem conex");
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.' + res.error, 'Erro');
                        return;
                    }

                    if (typeof res.length !== "undefined") {
                        //console.log(res.length + " results");
                    }

                    $.each(res, function (i, item) {
                        if (res[i].num) {
                            // ESTÁ NA MINHA LISTA DE CONTATOS QUE POSSUEM ADSAPP?
                            // ADICIONAR ESTA VERIFICAÇÃO ANTES DO AJAX
                            dbx('SELECT * FROM contact WHERE num = "' + res[i].num + '"', function (transaction, result) {
                                if (result.rows.length === 0) {
                                    var key = "", val = "";
                                    key += "id_server,num,num_local,nick";
                                    val += '"' + res[i].id + '",';
                                    val += '"' + res[i].num + '",';
                                    val += '"' + res[i].num_local + '",';
                                    val += '"' + res[i].nick + '"';
                                    dbQuery('INSERT INTO contact (' + key + ') VALUES (' + val + ')');
                                    //console.log("add adsapp contact: " + enc(res[i]));
                                    //$('[data-num="' + res[i].num_local + '"] .item-subtitle').html(" - ADSAPP USER");
                                }
                            });
                        }
                    });


                } // res not null
            }); // after ajax

}

function simulateContact() {

    var contacts = [];
    contacts.push({
        num: "+5527999999991",
        name: "João Williams",
        fb: "100006778331081"
    });
    contacts.push({
        num: "+5527999999992",
        name: "Mayconn Andrade",
        fb: "100000995783085"
    });
    contacts.push({
        num: "+5527999999993",
        name: "Marcus Teixeira",
        fb: "100001455409013"
    });
    contacts.push({
        num: "+5527999999994",
        name: "Michel Temer",
        fb: "100005617898093"
    });
    $.each(contacts, function (i, item) {
        console.log(contacts[i].num);
        myContacts.appendItem('<li class="showChat" data-num="' + contacts[i].num + '" data-name="' + contacts[i].name + '" data-fb="' + contacts[i].fb + '"><a href="#view-3" class="tab-link item-link item-content"><div class="item-media"><img src="http://graph.facebook.com/' + contacts[i].fb + '/picture?type=square" width="44"></div><div class="item-inner"><div class="item-title-row"><div class="item-title">' + contacts[i].name + '</div></div><div class="item-subtitle">' + contacts[i].num + '</div></div></a></li>');
        var key = "", val = "";
        key += "num,num_local,name,nick,id_fb";
        val += '"' + contacts[i].num + '",';
        val += '"' + contacts[i].num + '",';
        val += '"' + contacts[i].name + '",';
        val += '"' + contacts[i].name + '",';
        val += '"' + contacts[i].fb + '"';
        dbQuery('INSERT INTO contact (' + key + ') VALUES (' + val + ')');
    });

    return false;
    //checkContact(0);
    //checkContactDb(0);
}

