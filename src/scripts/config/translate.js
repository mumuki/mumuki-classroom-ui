
angular
  .module('classroom')
  .config(function ($translateProvider, LANG_EN, LANG_ES, LANG_ES_CL, LANG_PT) {

    const supportedLocales = ['es', 'es-CL', 'en', 'pt'];

    $translateProvider.translations('es', LANG_ES);
    $translateProvider.translations('es-CL', LANG_ES_CL);
    $translateProvider.translations('en', LANG_EN);
    $translateProvider.translations('pt', LANG_PT);

    $translateProvider.determinePreferredLanguage(() => {
      const locale = $translateProvider.resolveClientLocale().split('_')[0];
      const isSupportedLocale = _.includes(supportedLocales, locale);
      return isSupportedLocale ? locale : 'en';
    });

    $translateProvider.useSanitizeValueStrategy(null);

  });
