(function(app, angular) {
    app.controller('ExportImageController', function($scope, FileUploader, $timeout, ExportImageStore, RESTSTATUS) {
        var billListMock = {"data":{"list":[{"reimInfoId":10,"reimNum":"TR1102","applicationName":"吴伟森","reimTotal":333.00,"companyName":"我的企业","describe":"招待吃瓜群众","status":"未处理","fileCabinet":"待定-文件柜"}],"listCount":1}};
        var billDetailMock = {"data":[{"reimDataId":14,"reimDataNum":"e10e8b2e-02ac-41a7-9ffc-6cd6f994e9ba","iTime":1482422400000,"weekDay":"星期五","type":"国内单程机票","payForType":"个人垫付","describe":"222","total":333.0,"imageUrl":[{"imageId":110,"imageUrl":"http://image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg","imageStatus":null,"imageContentTitleList":[],"imageContentShowList":[]},{"imageId":111,"imageUrl":"http://image-demo.oss-cn-hangzhou.aliyuncs.com/f.jpg","imageStatus":null,"imageContentTitleList":[],"imageContentShowList":[]}],"checkStatus":"200"}]};
        var vm = $scope.vm = {
            listParameter: {
                pageSize: 20, // 每页20条
                pageIndex: 1, // 起始页 从1开始
                companyName: null, // 企业名称
                applicationName: null, //申请人名称
                reimNum: null, //报销单号
                startTime: null, //申请开始时间
                endTime: null, //申请结束时间
                listType: 1 // 列表类型
            },
            listTotal: 0, // 总数
            currentImg: null, // 当前展示的图片url
            billList: [], // 报销单列表
        };
        var _methods = {
            // 获取报销单列表
            getExportImageList: function(isReload) {
                if (isReload) {
                    vm.listParameter.pageIndex = 1;
                }
                vm.billList = angular.copy(billListMock.data.list);
                vm.listTotal = angular.copy(billListMock.data.listCount);
            },
            // 获取报销项集合
            getExportImageDetail: function(bill) {
                bill.billDetailItem = angular.copy(billDetailMock.data);
            },
            // 删除图片
            deleteImage: function(e, img, item) {
                e.preventDefault();
                e.stopPropagation();
                item.imageUrl = _.without(item.imageUrl, img);
                if (img.imageUrl == vm.currentImg) {
                    if (item.imageUrl[0] && item.imageUrl[0].imageUrl) {
                        vm.currentImg = item.imageUrl[0].imageUrl;

                    } else {
                        vm.currentImg = null;
                        item.showImgView = false;
                    }
                }
            },
            // 打开票据详情
            showBillDetail: function(bill) {
                // 若已打开，就直接关闭
                if (bill.showDetail) {
                    bill.showDetail = false;
                    // 循环关闭图片查看器
                    bill.billDetailItem.forEach(function(billItem) {
                        if (billItem['showImgView']) {
                            billItem['showImgView'] = false;
                        }
                    })
                } else {
                    // 根据报销单id获取报销项集合
                    _methods.getExportImageDetail(bill);
                    // 循环已打开的，关闭
                    vm.billList.forEach(function(billItem) {
                        if (billItem['showDetail']) {
                            billItem['showDetail'] = false;
                            // 循环关闭图片查看器
                            billItem.billDetailItem.forEach(function(billItem) {
                                if (billItem['showImgView']) {
                                    billItem['showImgView'] = false;
                                }
                            })
                        }
                    })
                    bill.showDetail = true;
                }
            },
            // 滚动轮播
            scrollTheTrips: function(direction, ulClassName, index) {
                var className = '.' + ulClassName + '-' + index;
                var currentLeft = $(className).scrollLeft();
                if (direction == 'left') {
                    $(className).animate({ scrollLeft: currentLeft - 200 }, 'fast');
                } else if (direction == 'right') {
                    $(className).animate({ scrollLeft: currentLeft + 200 }, 'fast');
                }
            },
            // 点击查看图片
            changeImg: function(bill, item, imgSrc) {
                if (!item.showImgView) {
                    bill.billDetailItem.forEach(function(billItem) {
                        if (billItem['showImgView']) {
                            billItem['showImgView'] = false;
                        }
                    })
                    $timeout(function() {
                        item.showImgView = true;
                    }, 0)
                }
                vm.currentImg = imgSrc;
            },
            // 上传图片
            uploaderImage: function(billDetailItem, index) {
                return new FileUploader({
                    'onSuccessItem': function(item, response, status, headers) {
                        if (response.status == RESTSTATUS['success']) {
                            _methods.uploadImage(billDetailItem, response.data, index)
                        } else {
                            var errInfo = res.msg || '链接错误，请稍后重试';
                            swal({
                                title: '',
                                text: '<h3>' + errInfo + '</h3>',
                                confirmButtonText: "确定",
                                html: true
                            });
                        }
                    }
                })
            },
        }
        $scope.methods = {
            scrollTheTrips: _methods.scrollTheTrips, // 滚动轮播
            changeImg: _methods.changeImg, // 点击查看图片
            showBillDetail: _methods.showBillDetail, // 打开票据详情
            uploaderImage: _methods.uploaderImage, // 上传图片
            getExportImageList: _methods.getExportImageList, // 获取列表
            deleteImage: _methods.deleteImage, // 删除图片
        }
        _methods.getExportImageList();
    });
})(angular.module('opApp'), angular);
