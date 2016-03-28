
angular
  .module('classroom')
  .controller('GuideProgressController', function ($scope, $stateParams, $interval, data, Api, DevIcon, RememberSetting) {
    RememberSetting($scope, 'showDetails');
    RememberSetting($scope, 'sortType');

    const guide = data.guide;

    const setGuideProgress = (guideProgress) => $scope.guideProgress = guideProgress;

    const guideProgressFetcher = $interval(() => Api.getGuideProgress($stateParams).then((data) => setGuideProgress(data.guideProgress)), 5000);

    setGuideProgress(data.guideProgress);

    $scope.guide = guide;
    $scope.devicon = DevIcon.from;

    if (_.isNil($scope.sortType)) {
      $scope.sortType = 'progress';
    }

    $scope.sortingCriteria = () => {
      return $scope.sortType === 'name' ?
        ['student.last_name', 'student.first_name'] :
        ['passedAverage()', 'exercises.length'];
    };

    $scope.$on('$destroy', () => $interval.cancel(guideProgressFetcher));
  });
