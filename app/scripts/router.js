(function(window, angular) {
    angular.module('opApp')
        .config(function($stateProvider) {
            var lazyDeferred = null;
            $stateProvider
                .state('exportImage', {
                    url: '/export_image',
                    templateUrl: './scripts/modules/export_image/exportImage.html',
                    data: {
                        title: '图片导入'
                    },
                    resolve: {
                        load: ['$ocLazyLoad',
                            function($ocLazyLoad) {
                                return $ocLazyLoad.load('exportImage');
                            }
                        ]
                    }
                })
        });

})(window, window.angular);
