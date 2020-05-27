angular
  .module('classroom')
  .directive('csvUpload', function () {

    return {

      restrict: 'E',
      templateUrl: 'views/directives/csv-upload.html',
      transclude: true,
      scope: {
        singleUploadClick: '=?',
        massiveUploadClick: '=',
        cancelClick: '=?',
        isEdit: '=',
      },
      controller: ($scope, $q) => {

        const rejectedPromise = () => $q((_, rej) => rej({ data: { message: 'Promise not provided' } }))

        $scope.singleUploadClick = $scope.singleUploadClick || rejectedPromise;
        $scope.massiveUploadClick = $scope.massiveUploadClick || rejectedPromise;
        $scope.cancelClick = $scope.cancelClick || rejectedPromise;
        $scope.isEdit = $scope.isEdit || false;

        $scope.toggleMultiple = () => {
          $scope.inputType.isMultiple = !$scope.inputType.isMultiple;
        }

        $scope.setAsPristine = () => {
          $scope.csv = {
            content: null,
            header: true,
            headerVisible: true,
            separator: ',',
            result: null,
            accept: '.csv'
          };
          $scope.response = {
            finish: false,
            result : {
              processed: [],
              processed_count: 0,
              existing_students: [],
              existing_students_count: 0,
            }
          }
        };

        $scope.inputType = {
          isMultiple: false,
          isLoading: false,
        }

        $scope.applyCsv = () => {
          $scope.inputType.isLoading = false;
        };

        $scope.massiveUpload = () => {
          return $scope.massiveUploadClick($scope.csv.result)
          .then((result) => $scope.response.result = result)
          .then(() => $scope.response.finish = true)
          .then(() => $scope.setAsPristine())
          .catch((res) => toastr.error(res.data.message));

        }

        $scope.setAsPristine();

      }

    }

  })
