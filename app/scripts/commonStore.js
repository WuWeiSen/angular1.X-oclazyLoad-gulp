(function(window, angular) {
    angular.module('opApp')
        .factory('CommonStore', function(FULL_API_URL, $resource) {
            return $resource(FULL_API_URL('login/logout'), {}, {
                // 退出
                logout: {
                    method: 'POST'
                }
            })
        })
})(window, window.angular);
