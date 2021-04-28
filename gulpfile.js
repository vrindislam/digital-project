const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    imageMin = require('gulp-imagemin'),
    jsMinify = require('gulp-js-minify'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync')

const paths = {
    src: {
        styles: "src/scss/**/*.scss",
        scripts: "src/js/**/*.js",
        images: "src/img/*.+(jpeg|png|svg|jpg|gif|ico)",
        html: 'src/index.html',
    },
    dist: {
        styles: "dist/css",
        scripts: "dist/js",
        images: "dist/img",
        root: 'dist',
    }
}

const cleanDist = () => (
    gulp.src(paths.dist.root, {allowEmpty: true})
        .pipe(clean())
)
gulp.task('cleanDist', cleanDist);

const buildJS = () => (
    gulp.src(paths.src.scripts)
        .pipe(concat('scripts.min.js'))
        .pipe(jsMinify())
        .pipe(gulp.dest(paths.dist.scripts))
)
gulp.task('buildJS', buildJS);

const buildCSS = () => (
    gulp.src(paths.src.styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest(paths.dist.styles))
)
gulp.task('buildCSS', buildCSS);

const buildImages = () => (
    gulp.src(paths.src.images)
        .pipe(imageMin())
        .pipe(gulp.dest(paths.dist.images))
)
gulp.task('buildImages', buildImages)

const buildHtml = () => (
    gulp.src(paths.src.html)
        .pipe(gulp.dest(paths.dist.root))
);

const serve = () => {
    gulp.watch(paths.src.html, buildHtml).on('change', browserSync.reload);
    gulp.watch(paths.src.styles, buildCSS).on('change', browserSync.reload);
    gulp.watch(paths.src.scripts, buildJS).on('change', browserSync.reload);

    return browserSync.init({
        server: {
            baseDir: paths.dist.root
        },
        files: [
            {match: paths.dist.root, fn: this.reload}
        ]
    })
};

gulp.task('serve', gulp.series(
    cleanDist,
    buildHtml,
    buildCSS,
    buildJS,
    buildImages,
    serve
));