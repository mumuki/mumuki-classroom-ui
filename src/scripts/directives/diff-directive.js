
angular
  .module('classroom')
  .directive('diffSide', function () {
    return {
      restrict: 'E',
      scope: {
        language: '@',
        left: '=',
        right: '='
      },
      templateUrl: 'views/diff.html',
      controller: ($scope) => {
        $scope.$watchGroup(['left', 'right'], () => {

          const lines = JsDiff.diffLines($scope.left, $scope.right);

          const prefix = (line, pre) => {
            let subLines = line.value.split('\n');
            if (_.isEmpty(_.last(subLines))) subLines.pop();
            return _.map(subLines, (l) => `${pre}${l}`).join('\n');
          };

          const diffLines = _.map(lines, (line) => {
            return (line.added)  ? prefix(line, '+') :
                  (line.removed) ? prefix(line, '-') : prefix(line, '  ');
          });

          const diffText = [
            'diff --git a/submission b/submission',
            'index fc56817..e8e7e49 100644',
            '--- a/submission',
            '+++ b/submission',
            '@@ -0,0 +0,0 @@',
            ...diffLines
          ].join('\n');

          const diffJson = Diff2Html.getJsonFromDiff(diffText);

          angular.element('#diff').html(Diff2Html.getPrettyHtml(diffJson, {
            inputFormat: 'json',
            showFiles: false,
            matching: 'lines',
            outputFormat: 'side-by-side'
          }));

        });
      }
    };
  });
