
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

    $scope.sortingCriteria = () => {
      return $scope.sortType === 'name' ?
        ['student.name'] :
        ['passedAverage()', 'exercises.length'];
    };

    $scope.$on('$destroy', () => $interval.cancel(guideProgressFetcher));

  });
