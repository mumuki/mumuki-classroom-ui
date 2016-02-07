
process.env.PORT = process.env.PORT || 8080;
process.env.TENANT = process.env.TENANT || 'central';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const del = require('del');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

const srcFolder = 'src';
const outFolder = 'build';

const configFile = () => `config/${process.env.NODE_ENV}.js`;

gulp.task('clean', () => del(`${outFolder}`, { force: true }));

gulp.task('config', () => {
  return gulp.src(`${configFile()}`)
    .pipe($.rename('config.js'))
    .pipe(gulp.dest(`${srcFolder}/scripts/config`))
});

gulp.task('dev:js', ['config'], () => {
  return gulp.src([`${srcFolder}/scripts/**/*.js`])
    .pipe($.sourcemaps.init())
      .pipe($.babel({ presets: ['es2015'] }))
      .pipe($.concat('main.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(`${outFolder}/scripts`))
    .pipe($.livereload());
});

gulp.task('dev:jade:views', () => {
  return gulp.src([`${srcFolder}/views/**/*.jade`])
    .pipe($.jade())
    .pipe(gulp.dest(`${outFolder}/views`))
    .pipe($.livereload());
});

gulp.task('dev:jade:index', () => {
  return gulp.src([`${srcFolder}/index.jade`])
    .pipe($.wiredep())
    .pipe($.jade({ pretty: true }))
    .pipe($.usemin())
    .pipe(gulp.dest(`${outFolder}`))
    .pipe($.livereload());
});

gulp.task('dev:scss', () => {
  return gulp.src([`${srcFolder}/styles/**/*.scss`])
    .pipe($.sass.sync())
    .pipe(gulp.dest(`${outFolder}/styles`))
    .pipe($.livereload());
});

gulp.task('dev:fonts', () => {
  return gulp.src([`${srcFolder}/fonts/**/*`])
    .pipe(gulp.dest(`${outFolder}/fonts`))
    .pipe($.livereload());
});

gulp.task('dev:images', () => {
  return gulp.src([`${srcFolder}/images/**/*`])
    .pipe(gulp.dest(`${outFolder}/images`))
    .pipe($.livereload());
});

gulp.task('dev:jade', ['dev:jade:index', 'dev:jade:views']);

gulp.task('dev:build', ['dev:js', 'dev:jade', 'dev:scss', 'dev:fonts', 'dev:images']);

gulp.task('dev:serve', ['dev:build'], () => {
  return gulp.src(`${outFolder}`)
    .pipe($.webserver({
      open: true,
      port: process.env.PORT,
      host: `${process.env.TENANT}.classroom.localmumuki.io`,
      livereload: true
    }));
});

gulp.task('dev:watch', () => {
  gulp.watch(`${configFile()}`, ['dev:js']);
  gulp.watch(`${srcFolder}/index.jade`, ['dev:jade:index']);
  gulp.watch(`${srcFolder}/fonts/**/*`, ['dev:fonts']);
  gulp.watch(`${srcFolder}/images/**/*`, ['dev:images']);
  gulp.watch(`${srcFolder}/scripts/**/*.js`, ['dev:js']);
  gulp.watch(`${srcFolder}/styles/**/*.scss`, ['dev:scss']);
  gulp.watch(`${srcFolder}/views/**/*.jade`, ['dev:jade:views']);
});

gulp.task('dev', (done) => runSequence('clean', 'dev:serve', 'dev:watch', done));

