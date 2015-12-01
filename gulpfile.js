var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglifyjs'),
	sourcemaps = require('gulp-sourcemaps'),
	connect = require('gulp-connect');

gulp.task('connect', function() {
	connect.server({
		root: [__dirname],
		livereload: true
	});
});

gulp.task('reload', function() {
	gulp.src('./*.html')
		.pipe(connect.reload());
});

gulp.task('uglify', function() {
	gulp.src([
			'js/src/vendor/TweenLite.min.js',
			'js/src/vendor/CSSPlugin.min.js',
			'js/src/carousel.js'
		]).pipe(uglify('main.min.js', {
			outSourceMap: true
		})).pipe(gulp.dest('./js'));
});

gulp.task('sass', function() {
	return gulp.src('./scss/style.scss')
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(sourcemaps.write({includeContent: false}))
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
	gulp.watch('./index.html', ['reload']);
	gulp.watch('./js/src/**/*.js', ['uglify', 'reload']);
	gulp.watch('./scss/**/*.scss', ['sass', 'reload']);
});

gulp.task('default', ['sass', 'uglify', 'connect', 'reload', 'watch']);