
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

        alert(sessionStorage.lat + "x" + sessionStorage.lng);

        if (isFunction(cb)) { // isfunction = index.js
            cb();
        }

    };
    function onError(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    setTimeout(function () {
        geo();
    }, 15000);
}