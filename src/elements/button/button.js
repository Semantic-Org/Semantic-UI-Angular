(function() {
'use strict';

angular
  .module('semantic.ui.elements.button', [])

  .directive('smButton', smButton);

  function smButton(ariaHelper) {
    return {
      restrict:'E',
      replace: true,
      transclude: true,
      template: setTemplate,
      link: function(scope, element, attrs) {
        var btnHasTextContent, node;

        node = element[0];

        if (isAnchorBtn(attrs)) {
          scope.$watch(attrs.ngDisabled, function(isDisabled) {
            element.attr('tabindex', isDisabled ? -1 : 0);
            if (isDisabled) {
              element.addClass('disabled');
            }
          });
        }

        btnHasTextContent = node.textContent.trim();
        if (!btnHasTextContent) {
          ariaHelper.hasAttribute(node, 'aria-label');
        }

        scope.$watch(attrs.ngDisabled, function(isDisabled) {
          if (isDisabled) {
            element.addClass('disabled');
          }
        });
      }
    };

    function isAnchorBtn(attrs) {
      return angular.isDefined(attrs.href) || angular.isDefined(attrs.ngHref)
    }

    function setTemplate(element, attrs) {
      if (isAnchorBtn(attrs)) {
        return '<a class="ui button" ng-transclude></a>'
      } else {
        return '<button class="ui button" ng-transclude></button>'
      }
    }
  }

})();
