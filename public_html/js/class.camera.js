//=================================
// CAMERA POST FORM
//=================================
$$(document).on('click', '#postCamera', function (e) {
    myApp.actions([
        [
            {
                text: 'Escolha uma opção',
                label: true
            },
            {
                text: 'CÂMERA',
                bold: true,
                color: "pink",
                onClick: function () {
                    postCameraGet(true);
                }
            },
            {
                text: 'GALERIA DE FOTOS',
                bold: true,
                color: "pink",
                onClick: function () {
                    postCameraGet();
                }
            }
        ],
        [
            {
                text: 'Cancelar',
                bold: false
            }
        ]
    ]);
});
function postCameraGet(gallery) {
    var type;
    if (typeof gallery === "undefined") {
        type = navigator.camera.PictureSourceType.PHOTOLIBRARY
    } else {
        type = navigator.camera.PictureSourceType.CAMERA
    }
    navigator.camera.getPicture(postCameraShow, function (message) {
        alert('get picture failed: ' + message);
    }, {
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: type,
        quality: 50,
        //allowEdit: true,
        //targetWidth: 612,
        //targetHeight: 100,
        saveToPhotoAlbum: true,
        popoverOptions: true,
        correctOrientation: true
    });
}
function postCameraShow(imageURI) {
    //alert(imageURI);
    //$("#post_camera").attr("src", imageURI);
    $("#postCamera").css("background-image", "url(" + imageURI + ")");
    $("#index-3 [name='fn']").val(imageURI);
}
function postCameraUpload(imageURI) {
    //alert(imageURI);
    myApp.showIndicator();
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    //alert(JSON.stringify(options.fileName));
    var params = new Object();

    // user data
    params.user_id = localStorage.user_id;
    params.user_email = localStorage.user_email;
    params.user_pass = localStorage.user_pass;
    options.params = params;
    options.chunkedMode = false;
    //alert(localStorage.server);
    var ft = new FileTransfer();
    ft.upload(imageURI, localStorage.server + "/upload.php", function (result) {
        myApp.hideIndicator();
        //alert(result);
        //alert(JSON.stringify(result));
        postSend(result.response);
        //postStart();
    }, function (error) {
        myApp.hideIndicator();
        alert(JSON.stringify(error));
    }, options);
}

//=================================
// CAMERA USER FORM
//=================================
$$(document).on('click', '#userCamera', function (e) {

    myApp.actions([
        [
            {
                text: 'Escolha uma opção',
                label: true
            },
            {
                text: 'CÂMERA',
                bold: true,
                color: "pink",
                onClick: function () {
                    userCameraGet(true);
                }
            },
            {
                text: 'GALERIA DE FOTOS',
                bold: true,
                color: "pink",
                onClick: function () {
                    userCameraGet();
                }
            }
        ],
        [
            {
                text: 'Cancelar',
                bold: false
            }
        ]
    ]);
});
function userCameraGet(gallery) {
    var type;
    if (typeof gallery === "undefined") {
        type = navigator.camera.PictureSourceType.PHOTOLIBRARY
    } else {
        type = navigator.camera.PictureSourceType.CAMERA
    }
    navigator.camera.getPicture(userCameraShow, function (message) {
        alert('get picture failed: ' + message);
    }, {
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: type,
        quality: 50,
        allowEdit: true,
        targetWidth: 300,
        targetHeight: 300,
        saveToPhotoAlbum: true,
        popoverOptions: true
    });
}
function userCameraShow(imageURI) {
    //alert(imageURI);
    //$("#post_camera").attr("src", imageURI);
    $("#profileImgBg").css("background-image", "url(" + imageURI + ")");
    $("#profileImgFront").css("background-image", "url(" + imageURI + ")");
    $("#user_form [name='user_img']").val(imageURI);
}
function userCameraUpload(imageURI) {
    //alert(imageURI);
    myApp.showIndicator();
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    //alert(JSON.stringify(options.fileName));
    var params = new Object();

    // user data
    params.user_id = localStorage.user_id;
    params.user_email = localStorage.user_email;
    params.user_pass = localStorage.user_pass;
    options.params = params;
    options.chunkedMode = false;
    //alert(localStorage.server);
    var ft = new FileTransfer();
    ft.upload(imageURI, localStorage.server + "/upload.php", function (result) {
        myApp.hideIndicator();
        userUpdate(result.response);
    }, function (error) {
        myApp.hideIndicator();
        alert(JSON.stringify(error));
    }, options);
}