
function getImage() {
    //alert(0);
    // Retrieve image file location from specified source
    navigator.camera.getPicture(uploadPhoto, function (message) {
        alert('get picture failed');
    }, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    }
    );
    //alert(1);
}

function uploadPhoto(imageURI) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

    $('#postImg').html("<img src='" + imageURI + "' width='90%' />");

    var params = new Object();
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(imageURI, "http://nickford.com.br/adsapp/upload.php", win, fail, options);
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    //alert(r.response);
    if (r.response === "error") {
        alert("Houve uma falha no servidor");
    }
    else {
        sessionStorage.postImg = r.response;
    }
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
}