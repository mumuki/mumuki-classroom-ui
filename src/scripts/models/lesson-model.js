
angular
  .module('classroom')
  .factory('Lesson', function (Guide) {

    class Lesson {

      constructor(lesson = {}) {
        _.defaults(this, lesson);
      }

      get slug() {
        return this.guide.slug;
      }

      get name() {
        return this.guide.name;
      }

      getName() {
        return `${this.number}. ${this.name}`;
      }

      getMumukiURL() {
        return this.guide.getMumukiURL();
      }

      iconClass() {
        return this.guide.iconClass();
      }

      static from(lesson = {}) {
        lesson.guide = Guide.from(lesson.guide);
        return new Lesson(lesson);
      }

    }

    return Lesson;

  })
