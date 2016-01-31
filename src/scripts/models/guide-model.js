
angular
  .module('classroom')
  .factory('Guide', function (DevIcon) {

    class Guide {

      constructor(guide = {}) {
        _.defaults(this, guide);
      }

      getName() {
        return this.name;
      }

      iconClass() {
        return `devicons devicons-${DevIcon.from(this.language.name)}`;;
      }

      static from(guide) {
        return new Guide(guide);
      }

    }

    return Guide;

  })
