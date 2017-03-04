
function enc(array_to_json) {
    return JSON.stringify(array_to_json);
}
function dec(json_to_array) {
    return JSON.parse(json_to_array);
}

//-----------------------------------
// INSERIR ARRAY EM SESSION STORAGE
//-----------------------------------
// array antes de chegar aqui deve ser definida como array={}
// ao inves de [], para ter chave alfanumerica
//-
// storeSet: Define um novo array ou remove já existente
function storeSet(name, array) {
    //
    this.scope = [name, array];
    debug(this);
    //
    if (array === undefined || array === 0) {
        sessionStorage.removeItem(name);
        console.log("remove=" + name);
    }
    else {
        sessionStorage[name] = JSON.stringify(array);
    }
}
// storeAdd: Insere um novo array a um array ja existente
function storeAdd(name, array) {
    //
    this.scope = [name, array];
    debug(this);
    //
    var arr = {};
    if (sessionStorage[name] !== undefined) {
        arr = JSON.parse(sessionStorage[name]);
        // adiciona
        arr.push(array);
    }
    // cria
    else {
        arr = [array];
    }
    sessionStorage[name] = JSON.stringify(arr);
    console.log(sessionStorage[name]);
}
// storeInc: Adiciona ou altera chave de um array já existente
function storeInc(name, inc_key, inc_val) {
    //
    this.scope = [name, inc_key, inc_val];
    debug(this);
    //
    var array = {};
    if (sessionStorage[name] !== undefined)
        var array = JSON.parse(sessionStorage[name]);

    if (inc_val === undefined)
        delete array[inc_key];
    else
        array[inc_key] = inc_val;
    //
    sessionStorage[name] = JSON.stringify(array);
}
// storeGet: Obtém valor de array já existente
function storeGet(name, key) {
    if (sessionStorage[name] === undefined)
        return undefined;
    var array = JSON.parse(sessionStorage[name]);
    if (key !== undefined)
        return array[key];
    else
        return array;
}