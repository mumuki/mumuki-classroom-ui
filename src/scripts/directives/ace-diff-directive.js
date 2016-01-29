
angular
  .module('classroom')
  .directive('aceDiff', function() {
    return {
      restrict: 'E',
      scope: {
        language: '@',
        left: '=',
        right: '='
      },
      templateUrl: 'views/ace-diff.html',
      controller: ($scope) => {
        $scope.$watchGroup(['left', 'right'], () => {
          if ($scope.aceDiff) {
            $scope.aceDiff.destroy();
          }

          $scope.aceDiff = new AceDiff({
            mode: `ace/mode/${$scope.language}`,
            left: {
              content: $scope.left,
              editable: false
            },
            right: {
              content: $scope.right,
              editable: false
            }
          });
        });
      }
    };
  });
