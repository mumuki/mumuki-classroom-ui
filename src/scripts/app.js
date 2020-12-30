import "../styles/main.scss"
import "../index.jade"

import 'expose-loader?$!jquery';
import 'expose-loader?jQuery!jquery';
import "lodash"
import "angular"
import "moment"
import "moment/locale/es"
import 'expose-loader?moment!moment';
import "@uirouter/angularjs"
import "angular-storage"
import "angular-jwt"
import "angular-animate"
import "angular-toastr"
import "angular-clipboard"
import "angular-cookies"
import "angular-translate"
import "angular-loading-bar"
import "angular-ui-bootstrap"
import "angularjs-bootstrap-datetimepicker"
import "angular-hotkeys"
import "@bower_components/angular-csv-import"
import "@bower_components/mumuki-styles/dist/javascripts/mumuki-styles"
import "@bower_components/mumuki-emojis/dist/javascripts/mumuki-emojis"
import "angular-bootstrap-switch"
import "bootstrap-switch"
import "angular-ui-ace"
import "angular-sanitize"
import "ui-select"
import "bootstrap-sass/assets/javascripts/bootstrap/tooltip"
import "bootstrap-sass/assets/javascripts/bootstrap/dropdown"
import "ace-builds/src-min-noconflict/ace"
import "./config/ace-mode-imports"

function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../views', true, /\.jade$/));

angular.module('classroom', [
  'ui.router',
  'angular-storage',
  'angular-jwt',
  'ngAnimate',
  'toastr',
  'angular-clipboard',
  'ngCookies',
  'pascalprecht.translate',
  'angular-loading-bar',
  'cfp.loadingBar',
  'ui.bootstrap',
  'ui.bootstrap.modal',
  'ui.bootstrap.datetimepicker',
  'cfp.hotkeys',
  'ngCsvImport',
  'frapontillo.bootstrap-switch',
  'ui.ace',
  'ngSanitize',
  'ui.select'
]);

requireAll(require.context('./', true, /\.js$/));
