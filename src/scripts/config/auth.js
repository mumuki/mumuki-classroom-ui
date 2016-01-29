
angular
  .module('classroom')
  .run((auth) => auth.hookEvents())
  .config((authProvider, CONFIG) => authProvider.init(CONFIG.auth));
