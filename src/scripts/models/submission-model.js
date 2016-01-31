
angular
  .module('classroom')
  .factory('Submission', function () {

    class Submission {

      constructor(submission = {}) {
        _.defaults(this, submission);
      }

      static from(submission) {
        return new Submission(submission);
      }

    }

    return Submission;

  })
