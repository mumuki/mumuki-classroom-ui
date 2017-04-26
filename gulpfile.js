
process.env.PORT = process.env.PORT || 8080;
process.env.TENANT = process.env.TENANT || 'central';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const gulpLoadPlugins = require('gulp-load-plugins');
const replaceEnvVar = (variable) => $.stringReplace(`<${variable}>`, process.env[variable]);

const $ = gulpLoadPlugins();

const srcFolder = 'src';
const outFolder = 'build';
const useminOptions = () => {
  return {
    development: {
      scss: [],
      es6: [],
      css: [$.minifyCss, $.rev],
      js: [$.uglify, $.rev]
    },
    production: {
      scss: [$.rev],
      es6: [$.rev],
      css: [$.minifyCss, $.rev],
      js: [$.uglify, $.rev]
    }
  }[process.env.NODE_ENV];
}

const configFile = () => `config/${process.env.NODE_ENV}.js`;

gulp.task('clean', () => del(`${outFolder}`, { force: true }));
gulp.task('release', (done) => {
  del('release', { force: true })
    .then(() => fs.renameSync(`${outFolder}`, 'release'))
    .then(done, done)
});

gulp.task('config', () => {
  return gulp.src(`${configFile()}`)
    .pipe(replaceEnvVar('MUMUKI_CLASSROOM_API_URL'))
    .pipe($.rename('config.js'))
    .pipe(gulp.dest(`${srcFolder}/scripts/config`))
});

gulp.task('dev:js', ['config'], () => {
  return gulp.src([`${srcFolder}/scripts/**/*.js`])
    .pipe($.sourcemaps.init())
      .pipe($.babel({ presets: ['es2015'] }))
      .pipe($.concat('main.js'))
      .pipe($.ngAnnotate())
      .pipe($.uglify())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(`${outFolder}/scripts`))
    .pipe($.livereload());
});

gulp.task('prod:js', ['config'], () => {
  return gulp.src([`${srcFolder}/scripts/**/*.js`])
    .pipe($.babel({ presets: ['es2015'] }))
    .pipe($.concat('main.js'))
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(gulp.dest(`${outFolder}/scripts`))
    .pipe($.livereload());
});

gulp.task('jade:views', () => {
  return gulp.src([`${srcFolder}/views/**/*.jade`])
    .pipe($.jade())
    .pipe(gulp.dest(`${outFolder}/views`))
    .pipe($.livereload());
});

gulp.task('jade:index', () => {
  return gulp.src([`${srcFolder}/index.jade`])
    .pipe($.wiredep({ includeSelf: true }))
    .pipe($.jade({ pretty: true }))
    .pipe($.usemin(useminOptions()))
    .pipe(gulp.dest(`${outFolder}`))
    .pipe($.livereload());
});

gulp.task('scss', () => {
  return gulp.src([`${srcFolder}/styles/main.scss`])
    .pipe($.sass.sync())
    .pipe(gulp.dest(`${outFolder}/styles`))
    .pipe($.livereload());
});

const bower = `${srcFolder}/bower_components`;
const fontPaths = [
  `${bower}/font-awesome/fonts/**/*`,
  `${bower}/dev-awesome/dist/fonts/**/*`,
  `${bower}/bootstrap-sass/assets/fonts/**/*`
];

gulp.task('fonts', () => {
  return gulp.src(fontPaths)
    .pipe(gulp.dest(`${outFolder}/fonts`))
    .pipe($.livereload());
});

gulp.task('images', () => {
  return gulp.src([`${srcFolder}/images/**/*`])
    .pipe(gulp.dest(`${outFolder}/images`))
    .pipe($.livereload());
});

gulp.task('jade', ['jade:index', 'jade:views']);

gulp.task('dev:build', (done) => {
  runSequence('clean', 'dev:js', 'scss', 'jade', 'fonts', 'images', done);
});

gulp.task('prod:build', (done) => {
  process.env.NODE_ENV = 'production';
  runSequence('clean', 'prod:js', 'scss', 'jade', 'fonts', 'images', 'release', done);
});

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
  gulp.watch(`${srcFolder}/index.jade`, ['jade:index']);
  gulp.watch(`${fontPaths}`, ['fonts']);
  gulp.watch(`${srcFolder}/images/**/*`, ['images']);
  gulp.watch(`${srcFolder}/scripts/**/*.js`, ['dev:js']);
  gulp.watch(`${srcFolder}/styles/**/*.scss`, ['scss']);
  gulp.watch(`${srcFolder}/views/**/*.jade`, ['jade:views']);
});

gulp.task('prod:serve', () => {
 return gulp.src(`${outFolder}`)
   .pipe($.webserver({
     port: process.env.PORT,
     host: '0.0.0.0'
   }));
});

gulp.task('dev', (done) => {
  process.env.NODE_ENV = 'development';
  runSequence('dev:serve', 'dev:watch', done);
});

gulp.task('prod', (done) => {
  process.env.NODE_ENV = 'production';
  runSequence('prod:serve', done);
});

gulp.task('test', (done) => {
  process.env.NODE_ENV = 'test';

  const wiredep = require('wiredep');
  const bower = require('./bower.json').main;
  const Server = require('karma').Server;

  new Server({
    configFile: `${__dirname}/karma.conf.js`,
    action: 'run',
    files: wiredep({ devDependencies: true }).js
      .concat(bower.filter((dep) => /\.js$/.test(dep)))
      .concat([
        'test/context.js',
        'src/scripts/**/*.js',
        'config/test.js',
        'test/**/*.test.js'
      ])
  }, done).start();
});

