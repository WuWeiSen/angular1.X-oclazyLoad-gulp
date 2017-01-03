(function(app, ng) {
    app.filter('price', function() {
        return function(input, keepOriginal) {
            if (keepOriginal) {
                input = +input;
            } else {
                input = Math.abs(+input);
            }
            if (typeof input != 'number') return;
            return input.toFixed(2);
        }
    });
})(angular.module('opApp'), angular);
