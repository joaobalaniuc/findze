//===================================
// FAZER DEBUG DE FUNÇÃO
// -
// function teste(id, fav) {
// 
//   this.scope [id,fav]; // repetir variaveis do escopo
//   debug(this); // inicio debug
//   ...
//   debug(this,1); // fim do debug
// 
// }
// -
//===================================
function debug(parent, end) {
    //
    if (sessionStorage.debug === 0) {
        return false;
    }
    // inicio ou fim da função?
    if (end === undefined)
        var pre = "*** [RUN]";
    else
        var pre = "--- [END]";
    // retorno
    var echo = pre + " ";
    // corpo da função
    var f = arguments.callee.caller.toString();
    // nome da função
    var myName = f.substr('function '.length);
    myName = myName.substr(0, myName.indexOf('(')); // separa nome da função
    echo += myName + " (";
    // variaveis
    if (parent !== undefined) { // tem variaveis?
        var strRem = 'function ' + myName + '('; // define string function <nome>
        var myVar = f.substr(strRem.length); // remove function <nome>
        myVar = myVar.substr(0, myVar.indexOf(')')); // separa string var1,var2,var3
        // separa variaveis
        var split = myVar.split(", ");
        for (var i = 0; i < split.length; i++) {
            var key = split[i];
            //var val = parent.window[split[i]];
            var val = parent.scope[i];
            echo += key + "=" + val;
            if (parseInt(i + 1) < split.length)
                echo += ", ";
        }
    }
    echo += ")";
    console.log(echo); // window["string"] lê variavel de nome "string"
    //alert(myName + "/" + myVar);
}
function fName() {
    var f = arguments.callee.caller.toString();
    // nome da função
    var myName = f.substr('function '.length);
    myName = myName.substr(0, myName.indexOf('(')); // separa nome da função
    return myName;
}
//================================
// ORGANIZADOR DE INÍCIO DE FUNÇÃO
// PARA FUNÇÃO SE:
// - AJAX EM ANDAMENTO
// - MODAL ON TOP
//================================
function halt(modalVisible) {
    return false;
    // nome da função
    var f = arguments.callee.caller.toString();
    var myName = f.substr('function '.length);
    myName = myName.substr(0, myName.indexOf('(')); // separa nome da função
    //
    if (s[myName]) {
        console.log(myName + " still running, ignore function");
        return true;
    }
    s[myName] = true;
    if (modalVisible) {
        if ($('.modal').is(":visible")) {
            console.log("modal on top, ignore function");
            return true;
        }
    }
}