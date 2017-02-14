# APP
开发一个脚手架 angular1.X + oclazyLoad + gulp

项目按模块开发，利用oclazyLoad按需加载每个模块的控制器，样式等。

利用gulp 将公用的js,css打成一个或多个app.js跟app.css

一些资源直接用cdn链接,减少服务器压力（哪些采用cdn需要自行判断）

js与css都用gulp md5化文件名,解决缓存

## Getting Started

1. run `npm install`
2. run `bower install`
3. run `gulp bower` (可省略)

   若自己添加了插件，可用gulp bower 将链接添加到index.html里面
4. run `gulp serve --env=prod`

   参数可以为dev(开发),test(测试),prod(生产),默认为dev

## Build

1. run `gulp build --env=prod` 

   打包代码
2. run `serve:prod` 

   访问打包后的代码
