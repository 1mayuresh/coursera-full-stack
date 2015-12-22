var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
//    browserSync = require('browser-sync'),
    ngannotate = require('gulp-ng-annotate'),
    foreach = require('gulp-foreach'),
    del = require('del');

var serverDir = '../json-server/public';

gulp.task('jshint', function() {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Cleanup
gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('cleanserverdir', function() {
    return del([serverDir], { force: true });
});

gulp.task('clear', function(done){
    return cache.clearAll(done);
});

// Default
gulp.task('default', ['clean'], function() {
    gulp.start('usemin', 'imagemin', 'copyfonts', 'copyserver');
});

gulp.task('usemin',['jshint'], function () {
    return gulp.src('./app/**/*.html')
        .pipe(foreach(function(stream, file) {
            return stream
                .pipe(usemin({
                    css:[minifycss(),rev()],
                    js: [ngannotate(),uglify(),rev()]
                }))
                .pipe(gulp.dest('dist/'));
        }));
});

// Images
gulp.task('imagemin', function() {
    del(['dist/images']);

    return gulp.src('app/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'));
        //.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('copyfonts', ['clean'], function() {
    gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copyserver', ['cleanserverdir', 'usemin'], function() {
   return gulp.src('dist/**/*')
       .pipe(gulp.dest(serverDir));
});

// Watch
gulp.task('watch', ['default'], function() {
    // Watch .js files
    gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin', 'copyserver']);
    // Watch image files
    gulp.watch('app/images/**/*', ['imagemin', 'copyserver']);

});

// doesn't work without Visual Studio C++ compiler...
//gulp.task('browser-sync', ['default'], function () {
//    var files = [
//        'app/**/*.html',
//        'app/styles/**/*.css',
//        'app/images/**/*.png',
//        'app/scripts/**/*.js',
//        'dist/**/*'
//    ];
//
//    browserSync.init(files, {
//        server: {
//            baseDir: "dist",
//            index: "index.html"
//        }
//    });
//    // Watch any files in dist/, reload on change
//    gulp.watch(['dist/**']).on('change', browserSync.reload);
//});
