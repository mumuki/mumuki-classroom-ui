
angular
  .module('classroom')
  .service('Domain', function ($location) {

    this.tenant = $location.host().split('classroom')[0];

  });
