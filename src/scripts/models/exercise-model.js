
angular
  .module('classroom')
  .factory('Exercise', function (Submission) {

    class Exercise {

      constructor(exercise = {}) {
        _.defaults(this, exercise);
      }

      getName() {
        return this.number ? `${ this.number }. ${ this.name }` : `${ this.name }`;
      }

      lastSubmission() {
        return _.maxBy(_.get(this, 'submissions', []), 'created_at');
      }

      static from(exercise) {
        exercise.submissions = _.map(exercise.submissions, Submission.from);
        return new Exercise(exercise);
      }

    }

    return Exercise;

  })
