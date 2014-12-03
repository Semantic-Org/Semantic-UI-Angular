(function() {
'use strict';

angular
  .module('semantic.ui.elements.button', [])

  .directive('semRadioBtn', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, ngModelCtrl) {
        if (!ngModelCtrl) { return; }

        function toggleElement() {
          var isActive = element.hasClass(getActiveClass());

          if (!isActive || attrs.uncheckable) {
            scope.$apply(function() {
              ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.semRadioBtn));
              ngModelCtrl.$render();
            });
          }
        }

        function getActiveClass() {
          var customClass = scope.$eval(attrs.semBtnClass);
          return (angular.isDefined(customClass)) ? customClass : 'active';
        }

        function changeElementState(value) {
          var radioBtnvalue = scope.$eval(attrs.semRadioBtn);
          element.toggleClass(getActiveClass(), angular.equals(value, radioBtnvalue));
          return value;
        }

        ngModelCtrl.$parsers.push(changeElementState);
        ngModelCtrl.$formatters.push(changeElementState);
        element.bind('click', toggleElement);
      }
    };
  });
})();
