(function(window, angular) {
    // 请求返回状态码
    var restStatus = {
        'success': '200',
        'unauthorized': '99999',
        'forbidden': '403',
        'unprocessable': '522'
    };
    angular.module('opApp')
        .constant('RESTSTATUS', restStatus)

})(window, window.angular);
