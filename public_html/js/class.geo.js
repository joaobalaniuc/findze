
function geo(cb) {

    var onSuccess = function (position) {
        sessionStorage.lat = position.coords.latitude;
        sessionStorage.lng = position.coords.longitude;
        /*alert('Latitude: ' + position.coords.latitude + '\n' +
         'Longitude: ' + position.coords.longitude + '\n' +
         'Altitude: ' + position.coords.altitude + '\n' +
         'Accuracy: ' + position.coords.accuracy + '\n' +
         'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
         'Heading: ' + position.coords.heading + '\n' +
         'Speed: ' + position.coords.speed + '\n' +
         'Timestamp: ' + position.timestamp + '\n');*/

        //alert(sessionStorage.lat + "x" + sessionStorage.lng);

        if (isFunction(cb)) { // isfunction = index.js
            cb();
        } else {
            setTimeout(function () {
                geo();
            }, 15000);
        }

    };
    function onError(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        geoIP();
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

}
function geoIP() {
    $.getJSON("http://ip-api.com/json/?callback=?", function (data) {
        sessionStorage.lat = Number(data.lat);
        sessionStorage.lng = Number(data.lon);
        sessionStorage.geoip = 1;
    });
}