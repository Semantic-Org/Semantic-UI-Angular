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
      template: '<div class="ui checkbox">' +
                  '<input type="checkbox">' +
                  '<label ng-transclude></label>' +
                '</div>',

      link: function(scope, element, attrs, ngModel) {

        var checked = false;
        var disabled = false;
        var input = angular.element(element).find('input');

        element.on('click', toggleFn);

        if (ngModel) {
          ngModel.$render = function() { 
            checked = ngModel.$viewValue;
            input.attr('checked', checked);
          };
        }
        scope.$watch(attrs.ngDisabled, function(val) {
          disabled = val || false;
          input.attr('disabled', disabled);
        });


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

          if (disabled) { return; }

          checked = !checked;
          input.attr('checked', checked);
          if (ngModel) {
            ngModel.$setViewValue(checked);
          }
          scope.$apply();
        }

      }
    };

  }
})();
