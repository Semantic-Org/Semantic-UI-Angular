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

        transclude(scope, function(nodes) {
          element.find('label').append(nodes);
        });

        element.on('click', toggleFn);

        if (!ngModel) {
          throw new Error('Semantic-UI-Angular: The \'smCheckbox\' directive requires a \'ng-model\' value');
        }

        ngModel.$render = function() {
          checked = ngModel.$viewValue;
          input.prop('checked', checked);
        };

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
          input.prop('checked', checked);
          ngModel.$setViewValue(checked);
          scope.$apply();
        }
      }
    };

  }
})();
