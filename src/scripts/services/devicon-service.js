
angular
  .module('classroom')
  .service('DevIcon', function () {

    const icons = { gobstones: 'celluloid', wollok: 'webplatform', text: 'code_badge' };

    this.from = (language) => {
      return icons[language] || language;
    };


  });
