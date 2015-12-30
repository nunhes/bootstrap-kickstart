var gulp = require('gulp');
var notify = require("gulp-notify");
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var duration = require('gulp-duration');
var del = require('del');
var frontmatter = require('gulp-front-matter');
var handlebars = require('gulp-hb');
var rename = require('gulp-rename');
var validator = require('gulp-html');
var logger = require('gulp-logger');
var bootlint  = require('gulp-bootlint');

// Configurable paths
var	config = {
	src: './src-for-gulp/',
	server: 'server'
};

/*
 * ***********************
 * ***** Clean tasks *****
 * ***********************
 */
gulp.task('cleanServer', function() {
	return del(['./' + config.server + '/**/*']);
});

/*
 * **********************
 * ***** Copy tasks *****
 * **********************
 */
gulp.task('copyAssetsToServer', function() {
	return gulp.src([
					config.src + 'assets/css/**/*',
					config.src + 'assets/js/**/*',
					config.src + 'assets/fonts/**/*',
					config.src + 'assets/img/**/*'
				], {
			base: config.src
		})
		.pipe(gulp.dest('./' + config.server));
});

gulp.task('copyLibsToServer', function() {
	return gulp.src([
					'./libs/**/*.js',
					'./libs/**/*.css',
					'./libs/bootstrap/fonts/*'
				], {
			base: './'
		})
		.pipe(gulp.dest('./' + config.server));
});

/*
 * *********************
 * ***** CSS tasks *****
 * *********************
 */
gulp.task('css', function() {
	return gulp.src(config.src + 'assets/less/index.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.on('error', notify.onError({
			message: '\nError: <%= error.message %>'
		}))
		.pipe(autoprefixer({
			browsers: [
					'> 1%',
					'last 3 version',
					'ie 8',
					'ie 9',
					'Firefox ESR',
					'Opera 12.1'
				]
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./assets/css'));
});

/*
 * ********************
 * ***** JS tasks *****
 * ********************
 */
gulp.task('scripts', function(done) {
	console.log('Nothing happening yet.');
	done();
});

gulp.task('html', function () {
	return gulp.src(config.src + '*.hbs')
		.pipe(frontmatter({ property: 'data' }))
		.pipe(handlebars({
			// debug: true,
			data: config.src + 'data/*.js',
			helpers: [
				'./node_modules/handlebars-layouts/index.js',
				config.src + 'helpers/*.js'
			],
			partials: config.src + 'partials/*.hbs'
		}))
		.pipe(rename({extname: '.html'}))
		// .pipe(validator());
		.pipe(gulp.dest('./' + config.server))
});

gulp.task('htmllint', function () {
	return gulp.src('./' + config.server + '/*.html')
		.pipe(logger({
			before: 'Starting validator',
			after: 'Validator complete!'
		}))
		.pipe(validator())
		.on('error', notify.onError({
			message: '\nError: <%= error.message %>'
		}))
		.pipe(bootlint({
			stoponerror: true,
			stoponwarning: true,
		}))
		.on('error', notify.onError({
			message: '\nError: <%= error.message %>'
		}));
});

/*
 * *******************************
 * ***** Glue tasks together *****
 * *******************************
 */
gulp.task('dev',
	gulp.series(
		'cleanServer',
		gulp.parallel('scripts', 'css', 'copyLibsToServer', 'html'),
		'htmllint',
		'copyAssetsToServer'
	)
);
