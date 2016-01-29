
angular
  .module('classroom')
  .controller('ExerciseProgressController', function ($scope, exerciseProgress, DevIcon) {

    const diffs = [];

    exerciseProgress.exercise.submissions = _.sortBy(exerciseProgress.exercise.submissions, 'created_at');

    _.forEach(exerciseProgress.exercise.submissions, (value, index, array) => {
      diffs.push({ left: value, right: array[index + 1] });
    });

    const MIN = 0;
    const MAX = diffs.length - 2 ;

    const index = () => _.indexOf(diffs, $scope.selectedDiff);
    const prev = () => Math.max(index() - 1, MIN);
    const next = () => Math.min(index() + 1, MAX);

    $scope.diffs = diffs;
    $scope.guide = exerciseProgress.guide;
    $scope.student = exerciseProgress.student;
    $scope.exercise = exerciseProgress.exercise;
    $scope.submissions = exerciseProgress.exercise.submissions;

    $scope.prev = () => $scope.selectDiff(diffs[prev()]);
    $scope.next = () => $scope.selectDiff(diffs[next()]);
    $scope.selectDiff = (diff) => $scope.selectedDiff = diff;
    $scope.isSelectedDiff = (diff) => _.isEqual($scope.selectedDiff, diff);

    $scope.selectDiff(diffs[MIN]);

  });
