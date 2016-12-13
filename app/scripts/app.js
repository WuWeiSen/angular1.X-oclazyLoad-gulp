(function(ng) {
    'use strict';
    ng.module('opApp', [
        'ngAnimate',
        'ngResource',
        'ngDialog',
        'ui.router',
    ]).run(function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeSuccess', function() {
            window.scrollTo(0, 0);
        });
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            ngDialog.close();
        });
    }).config(['ngDialogProvider', function(ngDialogProvider) {
        ngDialogProvider.setDefaults({
            closeByDocument: false
        });
    }]).config(function($httpProvider) {
        $httpProvider.interceptors.push('CustomHTTPInterceptor');
    }).factory('FULL_API_URL', function(API_HOST) {
        console.log(API_HOST)
        var BASE_URL = '/web/';
        return function(suffixUrl) {
            return API_HOST + BASE_URL + suffixUrl;
        };
    });
})(angular);
