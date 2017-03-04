
// Initialize your app
var myApp = new Framework7({
    cache: false,
    onPageInit: function (app, page) {
        console.log(page.name);
    }
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('*', function (page) {
    // run createContentPage func after link was clicked
    alert(1);
});
