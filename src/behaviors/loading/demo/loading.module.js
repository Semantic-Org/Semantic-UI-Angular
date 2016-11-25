(function() {
    'use strict';

    angular
        .module('semantic.ui.angular.loading',[
            'semantic.ui.behaviors.loading'
        ]).run(function($rootScope) {

          $rootScope.opts = {
            loading: true,
            objects: []
          };

        });

})();
