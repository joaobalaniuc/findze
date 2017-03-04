
// ================================
// CENTER ABSOLUTE ELEMENT
// ================================
function center($elem) {
    var ew = $elem.width();
    var eh = $elem.height();
    var w = $(window).width();
    var h = $(window).height();
    console.log("ew=" + ew + " eh=" + eh + " w=" + w + " h=" + h);
    $elem.css("position", "absolute")
            .css("left", parseInt(w / 2) + "px")
            .css("margin-left", "-" + parseInt(ew / 2) + "px")
            .css("top", parseInt(h / 2) + "px")
            .css("margin-top", "-" + parseInt(eh / 2) + "px");
}
