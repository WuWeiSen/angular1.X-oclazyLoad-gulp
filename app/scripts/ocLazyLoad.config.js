(function(window, angular) {

    angular.module('opApp')
        .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                events: true,
                modules: [{
                    name: 'exportImage',
                    files: [
                        './css/exportImage/exportImage.css',
                        './scripts/modules/exportImage/exportImageCtrl.js',
                        './scripts/modules/exportImage/exportImageStore.js'
                    ]
                }]
            });
        }])

})(window, window.angular);
