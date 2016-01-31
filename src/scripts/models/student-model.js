
angular
  .module('classroom')
  .factory('Student', function () {

    class Student {

      constructor(student = {}) {
        _.defaults(this, student);
      }

      static from(student) {
        return new Student(student);
      }

    }

    return Student;

  })
