(function() {
    'use strict';

    angular
      .module('semantic.ui.angular.radioButtons',[
          'ngAria',
          'semantic.ui.components.radioButton'
      ])
      .controller('RadioButtonsCtrl', function($scope) {
        $scope.radio = {
          value: 2
        };
      });
})();
