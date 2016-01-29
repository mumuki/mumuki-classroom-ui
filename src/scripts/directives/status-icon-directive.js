
angular
  .module('classroom')
  .directive('statusIcon', function () {
    return {
      restrict: 'E',
      scope: { status: '=' },
      template: '<i class="fa colorize-exercise-status" ng-class="statusIcon()"></i>',
      controller: ($scope) => {
        $scope.statusIcon = () => {
          switch ($scope.status) {
            case 'failed':
            case 'errored':
              return 'fa-times';

            case 'passed':
              return 'fa-check';

            case 'passed_with_warnings':
              return 'fa-exclamation';

            default:
              return 'fa-circle';
          }
        };
      }
    }
});
