'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var args = require('get-gulp-args')();
var open = require('open');
var sass = require('gulp-ruby-sass');
var htmlmin = require('gulp-htmlmin');
var revReplace = require('gulp-rev-replace');
var replaceFilesContent = require('gulp-batch-replace'); // 用来替换文件内容


var buildEnv = args.env || args.buildEnv || 'dev';

var sassCompilerConfig = {
    sourcemap: false,
    style: 'expanded',
    compass: true,
    lineNumbers: true
};

// sass源路径
var sassPath = ['app/scss/**/*.scss','app/scripts/modules/**/*.scss'];

gulp.task('bower', () => {
    return gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: './app/bower_components',
            overrides: {
                'bootstrap': {
                    'main': [
                        'dist/css/bootstrap.css',
                        'dist/js/bootstrap.js'
                    ]
                },
                'amazeui': {
                    'main': [
                        'dist/css/amazeui.css',
                        'dist/js/amazeui.js',
                        'dist/js/amazeui.ie8polyfill.js'
                    ]
                },
                'angular-file-upload': {
                    'main': [
                        'dist/angular-file-upload.js',
                    ]
                }
            }
        }))
        .pipe(gulp.dest('./app'));
});

gulp.task('serve', () => {
    runSequence('changEnv', 'start:client', 'buildSass', 'watch');
});

gulp.task('start:client', ['start:proxy'], () => {
    return open('http://localhost:9800');
})

gulp.task('start:proxy', function() {
    return $.connect.server({
        root: ['app'], // 若想运行打包后的代码，请将这里的"app"改为"dist"
        port: 9800,
        fallback: 'app/index.html', // 若想运行打包后的代码，请将这里的"app"改为"dist"
        livereload: true,
        middleware: (connect, opts) => {
            var middlewares = [];
            var url = require('url');
            var proxy = require('proxy-middleware');
            var createProxy = (prefixString, proxyServer) => {
                var options = url.parse(proxyServer);
                options.route = prefixString;
                return proxy(options);
            }
            middlewares.push(createProxy('/devapi', '')); // 设置各种api代理
            middlewares.push(createProxy('/testapi', ''));
            middlewares.push(createProxy('/api', ''));
            middlewares.push(createProxy('/imgapi', ''));
            return middlewares;
        }
    });
});

gulp.task('changEnv', function() {
    console.info("=== Build env.js with env '" + buildEnv + "'");
    gulp.src('./config/' + buildEnv + '.js')
        .pipe($.rename('env.js'))
        .pipe(gulp.dest('app/scripts'));
});

gulp.task('watch', () => {
    gulp.watch(sassPath, () => {
        return sass(sassPath, sassCompilerConfig)
            .on('error', sass.logError)
            .pipe(gulp.dest('./app/css'))
            .pipe($.connect.reload());
    });
    $.watch(['app/scripts/**/*.html', 'app/*.html', 'app/scripts/**/*.js'])
        .pipe($.connect.reload());
});

// 访问打包后的代码
gulp.task('serve:prod', ['build:proxy'], () => {
    return open('http://localhost:9000');
})

gulp.task('build:proxy', function() {
    return $.connect.server({
        root: ['dist'],
        port: 9000,
        fallback: 'dist/index.html',
        livereload: true,
        middleware: (connect, opts) => {
            var middlewares = [];
            var url = require('url');
            var proxy = require('proxy-middleware');
            var createProxy = (prefixString, proxyServer) => {
                    var options = url.parse(proxyServer);
                    options.route = prefixString;
                    return proxy(options);
                }
                // 设置各种api代理
            middlewares.push(createProxy('/api', ''));
            middlewares.push(createProxy('/imgapi', ''));
            return middlewares;
        }
    });
});

/*build*/
var cssRoad = ['./app/css/**/*.css', '!./app/css/common.css'];
gulp.task('buildSass', function() {
    return sass(sassPath, sassCompilerConfig)
        .on('error', sass.logError)
        .pipe(gulp.dest('./app/css'))
});


gulp.task('copyJs', function() {
    return gulp.src('./app/js/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'))
});

// ocLazyLoad.config.js替换js
gulp.task('revReplaceModule', ['revModuleJs', 'revModuleCss'], function() {
    return gulp.src('./app/scripts/ocLazyLoad.config.js')
        .pipe(revReplace({ manifest: gulp.src('./app/temp/**/rev-manifest.json') }))
        .pipe(gulp.dest('app/temp'));
});

gulp.task('revModuleJs', function() {
    return gulp.src('./app/scripts/modules/**/*.js')
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe($.rev())
        .pipe(gulp.dest('dist/scripts/modules'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('app/temp/rev-js'));
});

gulp.task('revModuleCss', ['buildSass'], function() {
    return gulp.src(cssRoad)
        .pipe($.cssnano())
        .pipe($.rev())
        .pipe(gulp.dest('dist/css'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('app/temp/rev-css'));
});

gulp.task('copyHtml', function() {
    return gulp.src('./app/scripts/modules/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/scripts/modules'));
});

gulp.task('copyOther', function() {
    return gulp.src('./app/*.ico')
        .pipe(gulp.dest('dist'))
});

gulp.task('copyImage', function() {
    return gulp.src('./app/images/*.*')
        .pipe(gulp.dest('dist/images'))
});

gulp.task('copyFonts', function() {
    return gulp.src('./app/fonts/*.{eot,otf,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('finalTask', function() {
    var jsFilter = $.filter('**/*.js', { restore: true });
    var cssFilter = $.filter('**/*.css', { restore: true });
    var replaceThis = [
        ['scripts/ocLazyLoad.config.js', 'temp/ocLazyLoad.config.js']
    ];
    return gulp.src('app/index.html')
        .pipe(replaceFilesContent(replaceThis))
        .pipe($.useref())
        .pipe(cssFilter)
        .pipe($.cssnano())
        .pipe($.rev())
        .pipe(cssFilter.restore)
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe($.rev())
        .pipe(jsFilter.restore)
        .pipe(revReplace())
        .pipe(gulp.dest('dist'))
});

gulp.task('cleanTemp', function() {
    return gulp.src('./app/temp')
        .pipe($.clean())
});

gulp.task('clean', function() {
    return gulp.src('./dist')
        .pipe($.clean())
});

gulp.task('build', ['clean'], function() {
    runSequence('changEnv', 'copyJs', 'revReplaceModule', 'copyHtml', 'copyOther', 'copyImage', 'copyFonts', 'finalTask', 'cleanTemp');
});
