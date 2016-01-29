
angular
  .module('classroom')
  .controller('GuideProgressController', function ($scope, $stateParams, $interval, guideProgress, Api, DevIcon) {

    guideProgress = [guideProgress];

    const guide = _.first(guideProgress).guide;

    const setGuideProgress = (guideProgress) => $scope.guideProgress = guideProgress;

    const guideProgressFetcher = $interval(() => Api.getGuideProgress($stateParams).then(setGuideProgress), 5000);

    $scope.guide = guide;
    $scope.devicon = DevIcon.from;
    $scope.sortType = 'progress';

    $scope.$on('$destroy', () => $interval.cancel(guideProgressFetcher));

  });
