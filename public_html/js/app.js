//--------------------------------------------
// INICIAR DISPOSITIVO
//--------------------------------------------
function start() {

    // App config
    localStorage.appname = "Findze";
    localStorage.version = "1.0.0";

    // Server
    localStorage.server = "http://dev.house/findze/";
    localStorage.server_img = "/upload/";

    // Dev
    sessionStorage.debug = 1;
    sessionStorage.activePage = "";

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

        // GPS enabled?
        cordova.plugins.diagnostic.isGpsLocationEnabled(function (enabled) {
            if (!enabled) {
                geoIP();
            }
        }, function (error) {
            //alert("The following error occurred: " + error);
        });

        app.receivedEvent('deviceready');

        // SPLASHSCREEN (CONFIG.XML BUGFIX)
        setTimeout(function () {
            navigator.splashscreen.hide();
            //StatusBar.hide();
        }, 1000);
        start();
        /*
         var push = PushNotification.init({
         "android": {
         "senderID": "722208907195"
         },
         "ios": {
         "alert": "true",
         "badge": "true",
         "sound": "true"
         },
         "windows": {}
         });
         
         push.on('registration', function (data) {
         //I can get registration id here
         //alert("token=" + JSON.stringify(data));
         
         $.ajax({
         url: localStorage.server + "/push_save_token.php",
         data: {token: data.registrationId},
         success: function (json) {
         }
         });
         });
         
         push.on('notification', function (data) {
         //this place doesn't work
         //alert("notification event");
         alert(JSON.stringify(data));
         });
         
         push.on('error', function (e) {
         alert("push error");
         });
         */

        // BACK BUTTON INDEX
        document.addEventListener("backbutton", function (e) {
            if (sessionStorage.activePage == "index" || sessionStorage.activePage == "user_login") {
                e.preventDefault();
            }
        }, false);

        //StatusBar.hide();

        geo();

    }
    ,
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
