
angular
  .module('classroom')
  .factory('GuideProgress', function (Guide, Course, Student, Exercise) {

    class GuideProgress {

      constructor(guideProgress = {}) {
        _.defaults(this, guideProgress);
      }

      stats() {
        const stats = _.countBy(this.exercises, (exercise) => _.last(exercise.submissions).status);
        stats.total = _.get(this, 'exercises.length', 0);
        return stats;
      }

      colorClass() {
        const passedAverage = this.passedAverage();
        return passedAverage <= 0.3 ? 'low' :
               passedAverage <= 0.6 ? 'medium' : 'high';
      }

      passedAverage() {
        const stats = this.stats();
        return (stats.passed / stats.total) || 0;
      }

      hasSubmissions() {
        return _.get(this, 'exercises.length', 0) > 0;
      }

      lastSubmission() {
        return this.lastExerciseSubmitted().lastSubmission();
      };

      lastExerciseSubmitted() {
        return _(this)
          .chain()
          .get('exercises', [])
          .maxBy((exercise) => _.maxBy(exercise.submissions, 'created_at').created_at)
          .value();
      };

      static from(guideProgress) {
        guideProgress.guide = Guide.from(guideProgress.guide);
        guideProgress.course = Course.from(guideProgress.course);
        guideProgress.student = Student.from(guideProgress.student);
        guideProgress.exercises = _.map(guideProgress.exercises, Exercise.from);
        return new GuideProgress(guideProgress);
      }

    }

    return GuideProgress;

  })
