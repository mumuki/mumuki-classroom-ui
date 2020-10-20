
angular
  .module('classroom')
  .service('Scroll', function ($timeout) {

    const FIXED_OFFSET = 28;

    this.bottom = (cssClass) => {
      $timeout(() => $(cssClass).scrollTop(this.currentScrollHeight(cssClass)));
    };

    this.holdContent = (cssClass, callback) => {
      const currentHeight = this.currentScrollHeight(cssClass);
      callback();
      $timeout(() => $(cssClass).scrollTop($(cssClass)[0].scrollHeight - currentHeight - FIXED_OFFSET));
    }

    this.currentScrollHeight = (cssClass) => {
      const $element = $(cssClass)[0];
      return $element ? $element.scrollHeight : 0;
    };
  });
