angular
  .module('classroom')
  .directive('csvUpload', function () {

    return {

      restrict: 'E',
      templateUrl: 'views/directives/csv-upload.html',
      transclude: true,
      scope: {
        massiveUploadClick: '=',
        massiveUploadTitleKey: '@?',
        massiveUploadSubtitleKey: '@?',

        singleUploadClick: '&?',
        cancelClick: '&?',

        onlyMassive: '=?',
        isEdit: '=?',
      },
      controller: ($scope, $q, toastr) => {

        const rejectedPromise = () => $q((_, rej) => rej({ data: { message: 'Promise not provided' } }))

        $scope.singleUploadClick = $scope.singleUploadClick || rejectedPromise;
        $scope.cancelClick = $scope.cancelClick || rejectedPromise;

        $scope.onlyMassive = $scope.onlyMassive || false;
        $scope.isEdit = $scope.isEdit || false;

        $scope.massiveUploadTitleKey = $scope.massiveUploadTitleKey ||  'massive_upload',

        $scope.toggleMultiple = () => {
          $scope.inputType.isMultiple = !$scope.inputType.isMultiple;
        }

        $scope.setCsvAsPristine = () => {
          angular.element('input[type="file"]').val(null)
          $scope.csv = {
            content: null,
            header: true,
            headerVisible: true,
            separator: ',',
            result: null,
            accept: '.csv'
          };
        };

        $scope.setAsPristine = () => {
          $scope.setCsvAsPristine();
          $scope.response = {
            finished: false,
            result : {
              processed: [],
              processed_count: 0,
              unprocessed: [],
              unprocessed_count: 0,
              errored_members: [],
              errored_members_count: 0,
            }
          }
        };

        $scope.inputType = {
          isMultiple: $scope.onlyMassive,
          isLoading: false,
        }

        $scope.applyCsv = () => {
          $scope.inputType.isLoading = false;
        };

        $scope.massiveUpload = () => {
          return $scope.massiveUploadClick($scope.csv.result)
            .then((result) => _.merge($scope.response.result, result))
            .then(() => $scope.response.finished = true)
            .catch((res) => toastr.error(_.get(res, 'data.message', 'Something wrong happens')))
            .finally(() => $scope.setCsvAsPristine());
        };

        $scope.setAsPristine();

        $scope.jsonToCsvString = (jsonArray = []) => {
          if (jsonArray.length === 0) return "";
          const header = _.chain(jsonArray).get(0, {}).keys().without('uid').value()
          let csv = header.join($scope.csv.separator)
          jsonArray.forEach(json => {
            csv += `\n${header.map(field => _.get(json, field, '')).join($scope.csv.separator)}`
          })
          return csv;
        }

        $scope.downloadAsCSV = (filename, array) => {
          const blob = new Blob([$scope.jsonToCsvString(array)]);
          const a = window.document.createElement("a");

          a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
          a.download = `${filename}.csv`;

          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }

      }

    }

  })
