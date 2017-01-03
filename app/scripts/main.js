(function(app, angular) {
    app.controller('IndexController', function($scope, CommonStore, RESTSTATUS) {
        var userInfoMock = {"data":{"userId":1,"uesrName":"管理员","phone":"18025353054","email":"admin@73go.cn"}};
        var vm = $scope.vm = {
            user: {}
        };
        var _methods = {
            // 获取用户信息
            getUserInfo: function() {
                vm.user = angular.copy(userInfoMock.data);
            },

            // 退出
            logout: function() {
                CommonStore.logout({}, {}, function(res) {
                    if (res.status == RESTSTATUS.success) {
                        window.location.href = '/login.html';
                    } else {
                        var errInfo = res.msg || '链接错误，请稍后重试';
                        swal({
                            title: '',
                            text: '<h3>' + errInfo + '</h3>',
                            confirmButtonText: "确定",
                            html: true
                        });
                    }
                })
            },
            /*-----------------------------我是华丽分割线，以上为调用ajax接口(大部分)--------------------------------*/
            applyLogout: function() {
                swal({
                        title: "确认退出？",
                        text: "",
                        showCancelButton: true,
                        confirmButtonColor: "#3bb4f2",
                        cancelButtonColor: "#F37B1D",
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            _methods.logout();
                        }
                    });
            }
        }
        $scope.methods = {
            applyLogout: _methods.applyLogout
        }
        _methods.getUserInfo();
    });
})(angular.module('opApp'), angular);
