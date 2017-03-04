$$(document).on('click', '#checkCode', function (e) {

    sessionStorage.confirm_code = $("#code").val();
    myApp.showIndicator();
    console.log(localStorage.server + " " + sessionStorage.confirm_code + " " + sessionStorage.confirm_cel)

    $.ajax({
        url: localStorage.server + "/codeCheck.json.php",
        data: {
            'num': sessionStorage.confirm_cel,
            'code': sessionStorage.confirm_code
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 7000
    })
            .always(function () {
                myApp.hideIndicator();
            })

            .fail(function () {
                myApp.alert('Desculpe, nosso servidor está em manutenção.', 'Ops!');
            })

            .done(function (res) {
                console.log(res);
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('O código informado é inválido.' + res.error, 'Erro');
                        return;
                    }
                    if (res.success) {
                        if (res.nick) {
                            profileConstruct(res);
                            localStorage.userNum = sessionStorage.confirm_cel;
                            view2.router.loadPage('index.html', {ignoreCache: true});
                            $('#toolbar').show();
                        } else {
                            view1.router.loadPage('welcome_profile.html', {ignoreCache: true});
                        }
                    }
                }
            });
});
$$(document).on('click', '#sendCode', function (e) {
    
    if ($("#ddd").val() == "" || $("#num").val() == "" || $("#cc").val() == "") {
        alert("Favor preencher todos os campos.");
        return false;
    }
    
    sessionStorage.confirm_cc = $("#cc").val();
    sessionStorage.confirm_ddd = $("#ddd").val();
    sessionStorage.confirm_num = $("#num").val();
    sessionStorage.confirm_cel = sessionStorage.confirm_cc + sessionStorage.confirm_ddd + sessionStorage.confirm_num;
    myApp.showIndicator();
    console.log(localStorage.server + " " + sessionStorage.confirm_cel);
    $.ajax({
        url: localStorage.server + "/codeSend.json.php",
        data: {
            'num': sessionStorage.confirm_cel
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 7000
    })
            .always(function () {
                myApp.hideIndicator();
            })

            .fail(function () {
                myApp.alert('Desculpe, nosso servidor está em manutenção.', 'Ops!');
            })

            .done(function (res) {

                $('#confirm').hide();
                $('#confirm_code').show();
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.' + res.error, 'Erro');
                        return;
                    }
                    if (res.success) {

                    }
                }
            });
});
$$(document).on('click', '#updateName', function (e) {

    sessionStorage.confirm_name = $("#name").val();

    myApp.showIndicator();

    console.log(localStorage.server + " " + sessionStorage.confirm_name);

    $.ajax({
        url: localStorage.server + "/updateProfile.json.php",
        data: {
            'num': sessionStorage.confirm_cel,
            'value': sessionStorage.confirm_name,
            'table': "nick"
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 7000
    })
            .always(function () {
                myApp.hideIndicator();
            })

            .fail(function () {
                myApp.alert('Desculpe, nosso servidor está em manutenção.', 'Ops!');
            })

            .done(function (res) {
                console.log(res);
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.' + res.error, 'Erro');
                        return;
                    }
                    if (res.success) {
                        profileConstruct(res);
                        localStorage.userName = sessionStorage.confirm_name;
                        localStorage.userNum = sessionStorage.confirm_cel;
                        view1.router.loadPage('index.html', {ignoreCache: true});
                        $('#toolbar').show();
                    }
                }
            });
});
$$(document).on('click', '#contactList', function (e) {
    //contactList();
});
$$(document).on('pageBeforeInit', '[data-page="welcome"]', function (e) {
    //$('#toolbar').hide();
});
$$(document).on('pageBeforeInit', '[data-page="welcome_profile"]', function (e) {
    //$('#toolbar').hide();
});