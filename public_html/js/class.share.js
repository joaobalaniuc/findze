$$(document).on('click', '.share', function (e) {
    var message = $(this).attr("data-message");
    var img = $(this).attr("data-img");
    share(message, img);
});

function share(message, img) {
    // this is the complete list of currently supported params you can pass to the plugin (all optional) 
    var options = {
        message: message + " - Baixe o AdsApp. Compre e venda de tudo!", // not supported on some apps (Facebook, Instagram) 
        subject: "AdsApp - Compre e venda de tudo!", // fi. for email 
        //files: ['', ''], // an array of filenames either locally or remotely 
        files: [img], // an array of filenames either locally or remotely 
        url: "https://build.phonegap.com/apps/2078405/share",
        chooserTitle: 'AdsApp Share' // Android only, you can override the default share sheet title 
    };

    var onSuccess = function (result) {
        alert("Share completed? " + result.completed); // On Android apps mostly return false even while it's true 
        alert("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false) 
    };

    var onError = function (msg) {
        alert("Sharing failed with message: " + msg);
    };

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}