
// AGE BY BIRTHDAY
function getAge(dateString) {
    /*
     this.scope = [dateString];
     debug(this);
     */
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// FORMAT USER NUMERIC PHONE
function formatNum(num) {
    var str = num.replace(/[()-]/g, '').split(' ').join('');

    if (str.charAt(0) == "0") {
        str = str.substring(1);
    }

    var myNum = localStorage.user_num;
    myN = myNum.split(" ");
    var myCc = myNum.substr(0, 3);
    var myDdd = myNum.substr(3, 5);

    if (str.charAt(0) != "+") {
        str = myCc + str;
    }
    return str;
}

// REPLACE ALL OCCURENCES OF A STRING
function replaceAll(string, token, newtoken) {
	while (string.indexOf(token) != -1) {
 		string = string.replace(token, newtoken);
	}
	return string;
}

// CLEAR "NULL" VALUES FOR DB INSERT
function clearNull(val) {
    var val = replaceAll(val, "'", "");
    val = replaceAll(val, '"', '');
    val = val.split(",");
    var val_ = "", virg = ",";
    $.each(val, function (key, value) {
        if (parseInt(key + 1) === val.length) {
            virg = "";
        }
        if (val[key] == "null") {
            val_ += "null,";
        }
        else {
            val_ += '"' + value + '"' + virg;
        }
    });
    return val_;
}