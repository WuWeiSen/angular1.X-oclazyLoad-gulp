/**
 * @Angular Image Viewer Directive
 *
 * @Author          : Ranjithprabhu K, WuWeiSen
 *
 * @Module Name     :   imageViewer
 *
 * @Directive Name  :   image-viewer [in DOM]
 *
 * @Description:  This handles the image viewer with image zoom-in, zoom-out, rotate-left, rotate-right options.
 *
 */

(function() {
    "use strict";
    angular.module('imageViewer', []).directive('imageViewer', function($timeout) {

        return {
            require: 'ngModel',
            restrict: 'EA',
            scope: {
                image: '=ngModel'
            },
            template: '<div id="image-zoom" style="position: relative; display:none;">\
                <div style="position: absolute; bottom: 30px; left: 50%; margin-left: -206px;">\
                <button id="girardir" class="btn btn-primary btn-md" ng-disabled="noImage"><span class="glyphicon glyphicon-menu-left"> </span>向左旋转</button>\
                <button id="giraresq" class="btn btn-primary btn-md" ng-disabled="noImage">向右旋转 <span class="glyphicon glyphicon-menu-right"> </span></button>\
                <button id="zoomIn" class="btn btn-info btn-md" ng-disabled="noImage"><span class="glyphicon glyphicon-zoom-in"> </span> 放大</button>\
                <button id="zoomOut" class="btn btn-info btn-md" ng-disabled="noImage"><span class="glyphicon glyphicon-zoom-out"> </span> 缩小</button>\
                <button id="carregar" class="btn btn-warning btn-md" ng-disabled="noImage"><span class="fa fa-arrow-left"> </span> 重置</button>\
                </div>\
                <div>\
                <span class="am-icon-close" ng-click="closeImageView()" id="close" style="cursor: pointer;position: absolute;right: 25px;top: 10px;font-size: 24px;"></span>\
                </div>\
                <h2 class="text-center text-danger" id="error-message" style="border:1px solid #e6e6e6;display:none;padding:20px">Image Not Available</h2>\
                <canvas id="canvas" height="500" style="border:1px solid #e6e6e6;z-index:555555;cursor:all-scroll;width: 100%"></canvas>\
                <img ng-src="{{image}}" id="currentImage" style="display:none" /> </div>',
            link: function(scope, element, attrs) {
                scope.noImage = false;

                //options for the zoom and rotate 
                var canvas = document.getElementById('canvas');
                var image = document.getElementById('currentImage');
                var ctx = canvas.getContext("2d");
                var angleInDegrees = 0;
                var zoomDelta = 0.1;
                var currentScale = 1;
                var currentAngle = 0;
                var novosDadosTRBL;
                var novosDadosWH;
                var novosDadosW;
                var novosDadosH;
                var startX, startY, isDown = false;
                scope.flag = 1;

                //method to reset the image to its original position
                angular.element('#carregar').click(function() {
                    startLoadImage();
                });

                // method to start load image
                function startLoadImage() {

                    if ($("#image-zoom").css("display") == "none") {
                        $("#image-zoom").show();
                        canvas.width = angular.element('#image-zoom').width();
                    }
                    //check the image load
                    angular.element('#image').on('load', resetImage())

                    //if the image is not loaded 
                    .on('error', function() {
                        //hide the canvas
                        angular.element('#canvas').hide();

                        //disable the buttons
                        scope.noImage = true;

                        //display the image not loaded text
                        angular.element('#error-message').show();
                        console.log("error loading image");
                    });
                }

                //method to reset the image
                function resetImage() {
                    //load the  image in canvas if the image is loaded successfully
                    ctx = canvas.getContext("2d");
                    angleInDegrees = 0;
                    currentScale = 1;
                    currentAngle = 0;

                    //for initial loading
                    if (scope.flag) {
                        scope.flag = 0;
                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        drawImage();
                    } else {
                        ctx.translate(0, 0);
                        drawImage();
                    }
                };

                //method to rotate the image in clockwise
                angular.element('#giraresq').click(function() {
                    //set the rotate angle for clockwise rotation
                    angleInDegrees = 45;
                    currentAngle += angleInDegrees;
                    drawImage();
                });


                //method to rotate the image in anti clockwise
                angular.element('#girardir').click(function() {
                    //set the rotate angle for anti clockwise rotation
                    angleInDegrees = -45;
                    currentAngle += angleInDegrees;
                    drawImage();
                });


                //method to zoom in the image
                angular.element('#zoomIn').click(function() {
                    currentScale += zoomDelta;
                    drawImage();
                });


                //method to zoom in and zoom out the image on mouse wheel scroll
                angular.element('#canvas').bind('mousewheel DOMMouseScroll', function(event) {
                    event.preventDefault();
                    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
                        // scroll up
                        currentScale += zoomDelta;
                        drawImage();
                    } else {
                        // scroll down
                        if (currentScale - zoomDelta - 0.1 > 1) {
                            currentScale -= zoomDelta;
                            drawImage();
                        }
                    }
                });

                //method to zoom out the image
                angular.element('#zoomOut').click(function() {
                    if (currentScale <= 1) return;
                    currentScale -= zoomDelta;
                    drawImage();
                });

                //method to get the mouse position when mouse button is down
                canvas.onmousedown = function(e) {
                    var pos = getMousePos(canvas, e);
                    startX = pos.x;
                    startY = pos.y;
                    isDown = true;
                }

                //method to update the image position in the canvas when it is dragged
                canvas.onmousemove = function(e) {
                    if (isDown === true) {
                        var pos = getMousePos(canvas, e);
                        var x = pos.x;
                        var y = pos.y;

                        ctx.translate(x - startX, y - startY);
                        drawImage();

                        startX = x;
                        startY = y;
                    }
                }

                //method to detect the mouse up for image dragging
                window.onmouseup = function(e) {
                    isDown = false;
                }

                //method to draw the image in the canvas from image element
                function drawImage() {
                    clear();
                    ctx.save();
                    ctx.scale(currentScale, currentScale);
                    ctx.rotate(currentAngle * Math.PI / 180);
                    ctx.drawImage(image, -image.width / 2, -image.height / 2);
                    ctx.restore();
                }

                //method to clear the canvas
                function clear() {
                    ctx.clearRect(-2000, -2000, 5000, 5000);
                }

                //method to get the mouse position
                function getMousePos(canvas, evt) {
                    var rect = canvas.getBoundingClientRect();
                    return {
                        x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top
                    };
                }
                // watch src
                scope.$watch('image', function(newValue, oldValue) {
                    if (scope.image) {
                        startLoadImage();
                    }
                    $timeout(function() {
                        drawImage();
                    }, 800)
                });

                // close imageView
                scope.closeImageView = function() {
                    $("#image-zoom").hide();
                    scope.image = null;
                    scope.flag = 1;
                }

            }
        }
    });

})();
