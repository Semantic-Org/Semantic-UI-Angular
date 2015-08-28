(function() {
'use strict';

angular
  .module('semantic.ui.behaviors.loading', [])

  .directive('smLoading', smLoading);

  smLoading.$inject = ['$parse'];

  function smLoading($parse) {
    return {
      restrict:'A',
      link: function(scope, element, attrs) {
        scope.$watch(function() {
          return $parse(attrs.smLoading)(scope);
        }, function(loading) {
          if (loading) {
            element.addClass('loading');
          } else {
            element.removeClass('loading');
          }
        });
      }
    };
  }

})();
