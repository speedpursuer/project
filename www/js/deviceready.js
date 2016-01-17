angular.element(document).ready(function () {
    if (window.cordova) {
        console.log("Running in Cordova, will bootstrap AngularJS once 'deviceready' event fires.");
        
        document.addEventListener('deviceready', function () {
            console.log("Deviceready event has fired, bootstrapping AngularJS.");            
            angular.bootstrap(document.body, ['app']);            
        }, false);
    } else {
        console.log("Running in browser, bootstrapping AngularJS now.");        
        angular.bootstrap(document.body, ['app']);
    }
	
	/*
	function javaScriptCall(){
		var scope = angular.element(document.getElementById('idForJS')).scope();
		scope.test();
	}*/
});

function updateClipThumb(){
	var scope = angular.element(document.getElementById('idForJS')).scope();
	scope.updateClipThumb();
}