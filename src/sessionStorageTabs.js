(function () {

    // //source: http://blog.guya.net/2015/06/12/sharing-sessionstorage-between-tabs-for-secure-multi-tab-authentication/ 

    // if (!sessionStorage.length) {
    //     // Ask other tabs for session storage
    //     localStorage.setItem('getSessionStorage', Date.now());
    // };

    // window.addEventListener('storage', function (event) {

    //     //console.log('storage event', event);

    //     if (event.key == 'getSessionStorage') {
    //         // Some tab asked for the sessionStorage -> send it

    //         localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
    //         localStorage.removeItem('sessionStorage');

    //     } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
    //         // sessionStorage is empty -> fill it

    //         var data = JSON.parse(event.newValue),
    //             value;

    //         for (key in data) {
    //             sessionStorage.setItem(key, data[key]);
    //         }

    //         showSessionStorage();
    //     }
    // });

    // window.onbeforeunload = function () {
    //     //sessionStorage.clear();
    // };

    // window.addEventListener("load", function() {
    //     if (!localStorage.tabs) {
    //         console.log("Create the tab count");
    //         localStorage.setItem("tabs", 1);
    //         // restore data in case of refresh, or set to initial value in case of new window
    //         localStorage.setItem("data", sessionStorage.getItem("data") || "Initial");
    //     } else {
    //         console.log("Add one tab to the count");
    //         localStorage.tabs++;
    //     }

    //     document.getElementById("tabs").innerHTML = "Open tabs = " + localStorage.tabs;
    // });

    // window.addEventListener("beforeunload", function() {
    //     if (parseInt(localStorage.tabs) == 1) {
    //         console.log("Last tab: remove localStorage");
    //         // save the data temporarily in the sessionStorage (in case of reload)
    //         sessionStorage.setItem("data", localStorage.getItem("data")); 
    //         localStorage.removeItem("tabs");
    //         localStorage.removeItem("data");
    //     } else {
    //         console.log("There are more tabs open, decrease count by 1");
    //         localStorage.tabs--;
    //     }
    // });
    
})();