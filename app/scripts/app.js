(function(angular) {
    'use strict';
    angular.module('opApp', [
        'ngResource',
        'ngDialog',
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'angularFileUpload',
        'imageViewer'
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
    }]).run(['uibPaginationConfig', function(paginationConfig) {
        paginationConfig.firstText = '<<';
        paginationConfig.previousText = '<';
        paginationConfig.lastText = '>>';
        paginationConfig.nextText = '>';
        paginationConfig.boundaryLinks = true;
        paginationConfig.maxSize = 5;
    }]).run(['uibDatepickerPopupConfig', function(uibDatepickerPopupConfig){
        uibDatepickerPopupConfig.clearText = '清除';
        uibDatepickerPopupConfig.currentText = '今天';
        uibDatepickerPopupConfig.closeText = '关闭';
    }]).config(function($httpProvider) {
        $httpProvider.interceptors.push('CustomHTTPInterceptor');
    }).factory('FULL_API_URL', function(API_HOST) {
        var BASE_URL = '/web/';
        return function(suffixUrl) {
            return API_HOST + BASE_URL + suffixUrl;
        };
    }).run(['fileUploaderOptions', function(fileUploaderOptions) {
        fileUploaderOptions.autoUpload = true;
        fileUploaderOptions.url = "/imgapi/image/upload"
    }]);
})(angular);
