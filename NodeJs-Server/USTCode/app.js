'use strict';

angular.module('myApp', [
  'ngRoute'
]);

/*Routing Aplicacion*/
angular.module('myApp').config(function($routeProvider){
    $routeProvider
    .when("/OtherView", {
        controller: 'OtherView.Controller',
        templateUrl : "views/OtherView/OtherView.html"
    })
    .when("/", {
        controller: 'ustData.controller',
        templateUrl : "views/UstData/UstData.html",
        controllerAs: 'ustData',
    })
});
