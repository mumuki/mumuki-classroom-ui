
angular
  .module('classroom')
  .factory('Guide', function (Domain) {

    class Guide {

      constructor(guide = {}) {
        _.defaults(this, guide);
      }

      get studentsCount() {
        return this.students_count;
      }

      getName() {
        return this.name;
      }

      getMumukiURL() {
        return Domain.guideURL(this.slug);
      }

      iconClass() {
        return `da da-${_.get(this, 'language.name') || _.get(this, 'language')}`;;
      }

      static from(guide = {}) {
        return new Guide(guide);
      }

    }

    return Guide;

  })
