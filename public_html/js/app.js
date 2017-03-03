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

        start();

        alert(0);

        geo();

        alert(1);

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

function geo() {

    alert("geo0");

    /**
     * This callback will be executed every time a geolocation is recorded in the background.
     */
    var callbackFn = function (location) {
        alert('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

        // Do your HTTP request here to POST location to your server. 
        // jQuery.post(url, JSON.stringify(location)); 

        /*
         IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
         and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
         IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
         */
        backgroundGeolocation.finish();
    };

    var failureFn = function (error) {
        alert('BackgroundGeolocation error');
    };

    // BackgroundGeolocation is highly configurable. See platform specific configuration options 
    backgroundGeolocation.configure(callbackFn, failureFn, {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        interval: 60000
    });

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app. 
    backgroundGeolocation.start();

    // If you wish to turn OFF background-tracking, call the #stop method. 
    // backgroundGeolocation.stop(); 


    alert("geo1");

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
    };
    function onError(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}