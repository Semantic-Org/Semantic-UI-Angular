(function() {
    'use strict';

    angular
      .module('semantic.ui.angular.radioButtons',[
          'ngAria',
          'semantic.ui.elements.radioButton'
      ])
      .controller('RadioButtonsCtrl', function($scope) {
        $scope.radio = {
          value: 2
        };
      });
})();