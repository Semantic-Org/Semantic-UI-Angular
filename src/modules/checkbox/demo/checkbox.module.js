(function() {
    'use strict';

    angular
        .module('semantic.ui.angular.checkbox',[
            'semantic.ui.components.checkbox',
            'ngAria'
        ]).run(function($rootScope) {

          $rootScope.opts = {
            disabled: true,
            checked: true
          };

        });

})();
