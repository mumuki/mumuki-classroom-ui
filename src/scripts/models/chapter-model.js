
angular
  .module('classroom')
  .factory('Chapter', function (Lesson) {

    class Chapter {

      constructor(chapter = {}) {
        _.defaults(this, chapter);
      }

      getName() {
        return `${this.number}. ${this.name}`;
      }

      static from(chapter = {}) {
        chapter.lessons = _.chain(chapter).get('lessons', []).map(Lesson.from).value();
        return new Chapter(chapter);
      }

    }

    return Chapter;

  })
