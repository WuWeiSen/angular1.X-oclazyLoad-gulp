(function(window, angular) {

    angular.module('opApp')
        .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                events: true,
                modules: [{
                    name: 'exportImage',
                    files: [
                        './css/export_image/exportImage.css',
                        './scripts/modules/export_image/exportImageCtrl.js'
                    ]
                }]
            });
        }])

})(window, window.angular);
