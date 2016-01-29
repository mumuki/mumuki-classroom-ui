
angular
  .module('classroom')
  .controller('GuideProgressController', function ($scope, $stateParams, $interval, guideProgress, Api, DevIcon) {

    const guide = guideProgress[0].guide;

    const setGuideProgress = (guideProgress) => $scope.guideProgress = guideProgress;

    const guideProgressFetcher = $interval(() => Api.getGuideProgress($stateParams).then(setGuideProgress), 5000);

    setGuideProgress(guideProgress);

    $scope.guide = guide;
    $scope.devicon = DevIcon.from;
    $scope.sortType = 'progress';

    $scope.statsFor = (progress) => {
      const stats = _.countBy(progress.exercises, (ex) => _.last(ex.submissions).status);
      stats.total = _.get(progress, 'exercises.length', 0);
      return stats;
    };

    $scope.progressFor = (progress) => {
      const stats = $scope.statsFor(progress);
      return (stats.passed / stats.total) || 0;
    };

    $scope.progressClass = (progress) => {
      const passedAverage = $scope.progressFor(progress);
      return passedAverage <= 0.3 ? 'low' :
             passedAverage <= 0.6 ? 'medium' : 'high';
    };

    $scope.hasSubmissions = (progress) => {
      return _.get(progress, 'exercises.length', 0) > 0;
    };

    $scope.sortingCriteria = (progress) => {
      return $scope.sortType === 'name' ?
        progress.student.name :
        $scope.progressFor(progress);
    };

    $scope.displayExerciseName = (exercise) => {
      return `${exercise.number}. ${ exercise.name }`;
    };

    $scope.lastExerciseSubmitted = (progress) => {
      return _(progress)
        .chain()
        .get('exercises', [])
        .maxBy((exercise) => _.maxBy(exercise.submissions, 'created_at').created_at)
        .value();
    };

    $scope.lastExerciseSubmissionFor = (exercise) => {
      return _.maxBy(_.get(exercise, 'submissions', []), 'created_at');
    };

    $scope.lastLiveSubmissionFor = (progress) => {
      return $scope.lastExerciseSubmissionFor($scope.lastExerciseSubmitted(progress));
    };

    $scope.$on('$destroy', () => $interval.cancel(guideProgressFetcher));

  });
