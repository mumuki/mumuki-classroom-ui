
angular
  .module('classroom')
  .factory('Submission', function () {

    class Submission {

      constructor(submission = {}) {
        submission.content = submission.content || '';
        _.defaults(this, submission);
      }

      colorClass() {
        switch (this.status) {
          case 'passed':                 return 'success';
          case 'passed_with_warnings':   return 'warning';
          case 'failed': case 'errored': return 'danger';
          default:                       return 'default';
        }
      }

      static from(submission) {
        return new Submission(submission);
      }

    }

    return Submission;

  })
