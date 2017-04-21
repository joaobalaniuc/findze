//========================================
// ...
//========================================
$(function () {

    if (typeof localStorage.user_id === "undefined") {
        return;
    }

});
//========================================
// VIEW-1: HOME (FILTER)
//========================================
$(function () {
    // filter on
    if (typeof sessionStorage.filter !== "undefined") {
        $$("#searchButton").css("text-shadow", "1px 1px 10px #fff");
        $$("#filter_but_cancel").show();
        //$$("#filter_cat").val(sessionStorage.filter_cat); // em postCatCb...
        $$("#filter_range").val(sessionStorage.filter_range);
        $$("#filter_range_val").html(sessionStorage.filter_range + " km");
        if (sessionStorage.filter_inpro > 0) {
            $$("#filter_inpro").prop('checked', true);
        } else {
            filterSet(true);
        }
    }
});
// FILTER BUTTON
$$(document).on('click', '#searchButton', function (e) {
    if ($("#searchForm").is(":visible")) {
        $("#searchButton i").css("color", "#fff");
        $("#searchForm").fadeOut("fast");
    } else {
        $("#searchButton i").css("color", "#000");
        $("#searchForm").fadeIn("fast");
    }
});
$$(document).on("input change", "#filter_range", function (e) {
    var range = this.value;
    $$("#filter_range_val").html(range + " km");
});

$$(document).on("click", "#filter_but_cancel", function (e) {
    sessionStorage.removeItem("filter");
    $$("#filter_cat").val("");
    $$("#filter_range").val(50);
    $$("#filter_range_val").html("50 km");
    $$("#filter_inpro").prop('checked', false);
    filterSet();
});
$$(document).on("click", "#filter_but_ok", function (e) {
    sessionStorage.filter = 1;
    filterSet();
});

function filterSet(stop) {
    sessionStorage.filter_cat = $$("#filter_cat").val();
    sessionStorage.filter_range = $$("#filter_range").val();
    if ($$("#filter_inpro").is(":checked")) {
        var inpro = 1;
    } else
        var inpro = 0;
    sessionStorage.filter_inpro = inpro;
    if (typeof stop === "undefined")
        window.location.href = "index.html";
}