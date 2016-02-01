
angular
  .module('classroom')
  .config((toastrConfig) => {

    angular.extend(toastrConfig, {
      positionClass: 'toast-bottom-left',
      preventDuplicates: false,
      preventOpenDuplicates: false,
      target: 'body'
    });

  });
