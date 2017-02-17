(function(window, angular) {
    angular.module('opApp')
        .factory('CommonStore', function(Restangular) {
            return {
                // 退出
                logout: function() {
                    return Restangular
                        .all('login/logout')
                        .post();
                }
            }
        })
})(window, window.angular);
