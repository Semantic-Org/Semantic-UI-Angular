(function() {
    'use strict';

    angular
      .module('semantic.ui.angular.buttons',[
        'ngAria',
        'semantic.ui.elements.button'
      ])
      .controller('ButtonsCtrl', function($scope) {
        $scope.isLoading = false;
        $scope.toggleLoader = function() {
          $scope.isLoading = !$scope.isLoading;
        }
      });

})();