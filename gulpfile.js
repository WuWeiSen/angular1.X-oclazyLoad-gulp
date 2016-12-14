'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var args = require('get-gulp-args')();
var open = require('open');
var sass = require('gulp-ruby-sass');

var buildEnv = args.env || args.buildEnv || 'dev';

var sassCompilerConfig = {
    sourcemap: false,
    style: 'expanded',
    compass: true,
    lineNumbers: true
};

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
                }
            }
        }))
        .pipe(gulp.dest('./app'));
});

gulp.task('serve', () => {
    runSequence('changEnv', 'start:client', 'watch');
});

gulp.task('start:client', ['start:proxy'], () => {
    return open('http://localhost:9103');
})

gulp.task('start:proxy', function() {
    return $.connect.server({
        root: ['app'],
        port: 9103,
        fallback: 'app/index.html',
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
            middlewares.push(createProxy('/mockapi', ''));
            middlewares.push(createProxy('/api/v1', ''));
            middlewares.push(createProxy('/api/v1', ''));
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
    gulp.watch(['app/scss/**/*.scss','app/scss/*.scss'], () => {
        return sass('app/scss/**/*.scss', sassCompilerConfig)
            .on('error', sass.logError)
            .pipe(gulp.dest('./app/css'))
            .pipe($.connect.reload());
    });
    $.watch(['app/scripts/**/*.html', 'app/index.html', 'app/scripts/**/*.js'])
        .pipe($.connect.reload());
});
