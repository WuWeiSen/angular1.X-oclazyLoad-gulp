# 代码规范

## 文件夹命名

```
easyNote
```

## JavaScript 代码规范

以[社区规范](https://github.com/airbnb/javascript/tree/es5-deprecated/es5)为标准。

## CSS 、html、SASS命名，以及书写规则
以http://qfang-frontend.github.io/code-guide/#css-declaration-order 为标准
```
## 公共样式，图片
公共样式写在app.scss里面，需要引用的模块（字体包，其他样式表等），也写在app.scss同一目录或新建文件夹（尽量不要新建），再在app.scss里面import进来
公共图片放在app/images文件夹里面

### 文件说明
modules 模块文件
- exportBill 票据导入

## 控制器写法
```
 app.controller('ExportImageController', function($scope) {
        var vm = $scope.vm = {
        };
        var _methods = {
            scrollTheTrips: function() {
            }
        }
        $scope.methods = {
            scrollTheTrips: _methods.scrollTheTrips
        }
    });
```

## 可能遇到的错误
> angular.element(".className") jqlite不可用     
  解决方式： 查看index.html，jquery的引用是否在angular之前


