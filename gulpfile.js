'use strict';

var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    prefixer    = require('gulp-autoprefixer'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    less        = require('gulp-less'),
    sourcemaps  = require('gulp-sourcemaps'),
    rigger      = require('gulp-rigger'),
    cssmin      = require('gulp-minify-css'),
    rimraf      = require('rimraf'),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload;

var path = {
    build: {
        html:  'public/',
        js:    'public/js/',
        lib:   'public/js/lib/',
        css:   'public/css/',
        img:   'public/img/',
        fonts: 'public/fonts/'
    },
    src: {
        html:  'src/*.html',
        js:    'src/js/main.js',
        style: 'src/style/main.less',
        img:   'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    bower: {
        jquery:        'bower_components/jquery/dist/jquery.min.js',
        bootstrap_css: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
        bootstrap_js:  'bower_components/bootstrap/dist/js/bootstrap.min.js',
        cycle2:        'bower_components/jquery-cycle2/build/jquery.cycle2.min.js',
    },
    watch: {
        html:  'src/**/*.html',
        js:    'src/js/**/*.js',
        style: 'src/style/**/*.less',
        img:   'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './public'
};

var config = {
    server: {
        baseDir: "./public"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "log"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(rename("main.js"))
        .pipe(gulp.dest(path.build.js))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(rename("main.min.js"))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});


gulp.task('bower:build', function () {
    gulp.src(path.bower.jquery)
        .pipe(gulp.dest(path.build.lib))
    gulp.src(path.bower.bootstrap_js)
        .pipe(gulp.dest(path.build.lib))
    gulp.src(path.bower.bootstrap_css)
        .pipe(gulp.dest(path.build.css))
    gulp.src(path.bower.cycle2)
        .pipe(gulp.dest(path.build.lib));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(prefixer())
        .pipe(rename("style.css"))
        .pipe(gulp.dest(path.build.css))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'bower:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);