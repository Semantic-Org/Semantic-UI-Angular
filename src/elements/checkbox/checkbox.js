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
                  '<label></label>' +
                '</div>',

      link: function(scope, element, attrs, ngModel, transclude) {

        var checked = false;
        var disabled = false;
        var input = element.find('input');

        transclude(function(nodes) {
          element.find('label').append(nodes);
        });

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
          element.addClass('toggle');
        }
        else if (attrs.slider !== void 0) {
          element.addClass('slider');
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
