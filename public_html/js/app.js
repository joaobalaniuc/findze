//--------------------------------------------
// INICIAR DISPOSITIVO
//--------------------------------------------
function start() {

    sessionStorage.start = 1;

    // App config
    localStorage.appname = "Findze";
    localStorage.version = "0.1";

    // Server
    //localStorage.server = "http://192.168.0.100/mycare/server/"; // casa
    //localStorage.server = "http://10.0.0.35/mycare/server/"; // allware
    localStorage.server = "http://feirafree.com.br/mycare/"; // casa
    localStorage.server_img = "/app/pic/img/";

    // Ajax timeout
    localStorage.timeout = 5000; // ajax
}

var app = {
// Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("online", onOnline, false);
        function onOnline() {
            sessionStorage.online = true;
        }
        document.addEventListener("offline", onOffline, false);
        function onOffline() {
            sessionStorage.online = false;
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {

        app.receivedEvent('deviceready');

        //start();
        
        geo();

        // SPLASHSCREEN (CONFIG.XML BUGFIX)
        setTimeout(function () {
            navigator.splashscreen.hide();
            if (window.StatusBar) {
                /*StatusBar.overlaysWebView(false);
                 StatusBar.backgroundColorByHexString("#3f51b5");
                 StatusBar.styleLightContent();*/
            }
        }, 500);
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        /*var parentElement = document.getElementById(id);
         var listeningElement = parentElement.querySelector('.listening');
         var receivedElement = parentElement.querySelector('.received');
         listeningElement.setAttribute('style', 'display:none;');
         receivedElement.setAttribute('style', 'display:block;');*/
        console.log('Received Event: ' + id);
    }
};

function geo(cb) {

    var onSuccess = function (position) {
        sessionStorage.lat = position.coords.latitude;
        sessionStorage.lng = position.coords.longitude;
        alert('Latitude: ' + position.coords.latitude + '\n' +
         'Longitude: ' + position.coords.longitude + '\n' +
         'Altitude: ' + position.coords.altitude + '\n' +
         'Accuracy: ' + position.coords.accuracy + '\n' +
         'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
         'Heading: ' + position.coords.heading + '\n' +
         'Speed: ' + position.coords.speed + '\n' +
         'Timestamp: ' + position.timestamp + '\n');

        //alert(sessionStorage.lat + "x" + sessionStorage.lng);

        if (isFunction(cb)) { // isfunction = index.js
            cb();
        }

    };
    function onError(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}