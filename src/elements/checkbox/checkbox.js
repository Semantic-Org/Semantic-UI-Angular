(function() {
  'use strict';

  angular
    .module('semantic.ui.elements.checkbox', [])

    .directive('smCheckbox', smCheckbox);

  function smCheckbox() {
    return {
      restrict: 'E',
      require: '?ngModel',
      transclude: true,
      replace: true,
      scope: {
        ngDisabled: '='
      },
      template: '<div class="ui checkbox" ng-class="{ checked: isChecked }">' +
                  '<input type="checkbox" ng-disabled="ngDisabled" ng-checked="isChecked">' +
                  '<label ng-transclude></label>' +
                '</div>',

      link: function(scope, element, attrs, ngModel) {


        element.bind('click', toggleFn);

        if (ngModel) {
          ngModel.$render = function() { 
            scope.isChecked = ngModel.$viewValue;
          };
        }

        if (attrs.toggle !== void 0) {
          angular.element(element).addClass('toggle');
        }
        else if (attrs.slider !== void 0) {
          angular.element(element).addClass('slider');
        }

        if (attrs.ariaLabel === void 0) {
          element.attr('aria-label', element[0].textContent.trim());
        }

        function toggleFn() {

          if (scope.ngDisabled) { return; }

          scope.isChecked = !scope.isChecked;
          if (ngModel) {
            ngModel.$setViewValue(scope.isChecked);
          }
          scope.$apply();
        }

      }
    };

  }
})();
