//============================================
// KEYUP SEARCH
//============================================
$$(document).on("click", ".searchbar-clear", function (e) {
    $("#search_list").hide();
    $("#search_block").show();
    $("#search_ajax").html("");
});

$$(document).on("keyup", "#kw", function (e) {
    var txt = $("#kw").val();
    if (txt.length > 1) {
        search(txt, searchCb);
        $(".searchTxt").html(txt);

        $("#search_list ul").hide();
        $("#search_loader").show();
        $("#search_ajax").html("");

        if ($("#search_list:hidden")) {
            $("#search_block").fadeOut("fast", function () {
                $("#search_list").fadeIn("fast");
            });
        }
    }
    else {
        $("#search_list").hide();
        $("#search_block").show();
    }
});

var xhr;
function search(txt, cb) {

    if (typeof xhr === "object") {
        xhr.abort();
    }

    xhr = $.ajax({
        url: localStorage.server + "/search.php",
        data: {
            txt: txt
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                $("#search_list ul").hide();
            })

            .fail(function () {
                var r = {"fail": true};
                sessionStorage.searchStatus = "fail";
                cb(r);
            })

            .done(function (res) {
                sessionStorage.searchStatus = 1;
                cb(res);
            }); // after ajax

}
function searchErr() {
    if (sessionStorage.searchStatus === "fail") {
        $("#search_list ul").hide();
        $("#search_err").show();
    }
}
function searchCb(res) {

    if (res !== null) {

        console.log(res);

        if (res === false) {
            $("#search_none").show();
            return;
        }
        if (res.error) {
            $("#search_err").show();
            return;
        }
        if (res.fail) {
            setTimeout(function () {
                searchErr();
            }, 3000);

            return;
        }

        $("#search_res").show();

        var i = 0;
        $.each(res, function (key, val) {

            i++;

            $("#search_template")
                    .clone()
                    .prop({
                        id: "search_" + val["post_id"]
                    })
                    .appendTo("#search_ajax")
                    .attr("data-id", val["post_id"]);

            $("#search_" + val["post_id"]).each(function (index) {

                $(this).find(".post_name").html(val["post_name"]);

                $(this).find(".post_read").attr("data-id", val["post_id"]);

                if (val["img_fn"] != null) {
                    $(this).find(".img_fn").attr("src", localStorage.server + localStorage.server_img + "thumb_" + val["img_fn"]);
                }
                if (val["post_price"] !== null) {
                    $(this).find(".post_price").html("R$ " + val["post_price"]);
                }

            }).show();

        });
    } // res not null
    else {
        $("#search_err").show();
    }
}