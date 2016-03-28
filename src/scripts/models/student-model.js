
angular
  .module('classroom')
  .factory('Student', function () {

    class Student {

      constructor(student = {}) {
        _.defaults(this, student);
      }

      fullName() {
        return `${this.last_name}, ${this.first_name}`
      }

      static from(student) {
        return new Student(student);
      }

    }

    return Student;

  })
