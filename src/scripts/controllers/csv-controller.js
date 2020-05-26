angular
  .module('classroom')
  .controller('CsvController', function ($scope) {

    $scope.setAsPristine = () => {
      $scope.csv = {
        content: null,
        header: true,
        headerVisible: true,
        separator: ',',
        result: null,
        uploadButtonLabel: "Seleccionar"
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

  });
