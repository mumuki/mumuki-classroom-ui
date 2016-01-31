
angular
  .module('classroom')
  .factory('ExerciseProgress', function (Guide, Course, Student, Exercise, Submission) {

    class ExerciseProgress {

      constructor(exerciseProgress = {}) {
        _.defaults(this, exerciseProgress);

        this.diffs = [];
        this.exercise.submissions = _.sortBy(this.exercise.submissions, 'created_at');

        _.forEach(this.exercise.submissions, (value, i, array) => {
          this.diffs.push({ left: Submission.from(array[i - 1]), right: Submission.from(value) });
        });
      }

      getName() {
        return `${this.exercise.name} -  ${this.guide.name}`;
      }

      submissionsCount() {
        return _.get(this, 'exercise.submissions.length', 0);
      }

      static from(exerciseProgress) {
        exerciseProgress.guide = Guide.from(exerciseProgress.guide);
        exerciseProgress.course = Course.from(exerciseProgress.course);
        exerciseProgress.student = Student.from(exerciseProgress.student);
        exerciseProgress.exercise = Exercise.from(exerciseProgress.exercise);
        return new ExerciseProgress(exerciseProgress);
      }

    }

    return ExerciseProgress;

  })
