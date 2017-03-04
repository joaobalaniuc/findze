// Add views
var view1 = myApp.addView('#view-1', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true //enable inline pages
});
var view2 = myApp.addView('#view-2', {
    dynamicNavbar: true,
    domCache: true
});
var view3 = myApp.addView('#view-3', {
    dynamicNavbar: true,
    domCache: true
});
var view4 = myApp.addView('#view-4', {
    dynamicNavbar: true,
    domCache: true
});
/*
 var mainView = myApp.addView('.view-main', {
 domCache: true //enable inline pages
 });
 */