(function() {
    'use strict';

  angular
    .module('demo', ['semantic.ui.elements.rating'])
    .controller('RatingDemoCtrl', function($scope) {
      $scope.rate = 7;
      $scope.max = 10;
      $scope.isReadonly = false;

      $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
      };
    });
})();
