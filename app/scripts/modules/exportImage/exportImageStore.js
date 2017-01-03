(function(window, angular) {
    angular.module('opApp')
        .factory('ExportImageStore', function(FULL_API_URL, $resource) {
            return $resource(FULL_API_URL('imageImport/delete/:id'), {}, {
                // 图片导入-删除图片
                deleteImage: {
                    method: 'DELETE'
                }
            })
        })
})(window, window.angular)
