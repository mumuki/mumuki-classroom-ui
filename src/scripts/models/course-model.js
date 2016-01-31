
angular
  .module('classroom')
  .factory('Course', function () {

    class Course {

      constructor(course = {}) {
        _.defaults(this, course);
      }

      getName() {
        return this.slug.split('/').join(' - ');
      }

      iconClass() {
        return 'fa fa-graduation-cap';
      }

      static from(course) {
        return new Course(course);
      }

    }

    return Course;

  })
