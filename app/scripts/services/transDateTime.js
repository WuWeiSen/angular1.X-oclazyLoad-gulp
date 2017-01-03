/*
 startTime 的时间戳是转成XXXX-XX-XX 00:00:00
 endTime   的时间戳是转成XXXX-XX-XX 23:59:59
*/
(function(window, angular) {

    'use strict';

    angular.module('opApp')

    .factory('TransDateTime', function() {
        var resultTime;
        return function(time, type) {
            if(!time) return null;
            var startTimeString = new Date(time).getFullYear() + '-' + (new Date(time).getMonth() + 1) + '-' + new Date(time).getDate();
            if (type == 'start') {
                resultTime = new Date(startTimeString).getTime() - 28800000;
            } else if (type == 'end'){
                resultTime = new Date(startTimeString).getTime() - 28800000 + 86399000;;
            }
            return resultTime;
        };
    });

})(window, window.angular);
