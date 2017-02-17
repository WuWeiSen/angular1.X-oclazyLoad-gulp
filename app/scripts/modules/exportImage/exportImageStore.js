(function(window, angular) {
    angular.module('opApp')
        .factory('ExportImageStore', function(Restangular) {
            return {
                // 获取列表 GET
                getList: function(params) {
                    return Restangular
                        .all('imageImport/reimlist')
                        .get('', params);
                },

                // 获取详情 GET
                getDetail: function(id) {
                    return Restangular
                        .all('imageImport/reimdatalist')
                        .get(id);
                },

                // 录入完成 POST
                enterFinish: function(params) {
                    return Restangular
                        .all('imageEnter/enterFinish')
                        .post(params);
                },

                // 删除问题 DELETE
                deleteQuestion: function(id, params) {
                    return Restangular
                        .all('imageEnter/deleteQuesRecord/' + id)
                        .remove(params)
                },

                // 提交 PUT
                putSomething: function(id, params) {
                    return Restangular
                        .all('imageEnter/putSomething/'  + id)
                        .customPUT(params)
                }
            }
        })
})(window, window.angular)
