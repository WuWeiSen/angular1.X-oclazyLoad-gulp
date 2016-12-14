(function(ng) {
    'use strict';
    ng.module('opApp', [
        'ngAnimate',
        'ngResource',
        'ngDialog',
        'oc.lazyLoad',
        'ui.router',
    ]).run(function($rootScope, $state, $stateParams, ngDialog) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeSuccess', function() {
            window.scrollTo(0, 0);
        });
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            ngDialog.close();
        });
    }).config(['$urlRouterProvider', '$locationProvider',
      function($urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/exportImage');
        $locationProvider.html5Mode(true);
      }
    ]).config(['ngDialogProvider', function(ngDialogProvider) {
        ngDialogProvider.setDefaults({
            closeByDocument: false
        });
    }]).config(function($httpProvider) {
        $httpProvider.interceptors.push('CustomHTTPInterceptor');
    }).factory('FULL_API_URL', function(API_HOST) {
        var BASE_URL = '/web/';
        return function(suffixUrl) {
            return API_HOST + BASE_URL + suffixUrl;
        };
    });
})(angular);
