(function() {
    'use strict';

    angular
      .module('semantic.ui.angular.buttons',[
        'ngAria',
        'semantic.ui.elements.button',
        'semantic.ui.elements.icon',
        'semantic.ui.elements.divider'
      ])
      .controller('ButtonsCtrl', function($scope) {
        $scope.isLoading = false;
        $scope.toggleLoader = function() {
          $scope.isLoading = !$scope.isLoading;
        }
      });

})();