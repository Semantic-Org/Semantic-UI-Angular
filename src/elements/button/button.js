(function() {
'use strict';

angular
  .module('semantic.ui.elements.button', [])

  .directive('smButton', smButton);

  smButton.$inject = ['$animate'];

  function smButton($animate) {
    return {
      restrict:'E',
      replace: true,
      transclude: true,
      template: setTemplate,
      scope: {
        isLoading: '=loading'
      },
      link: function(scope, element, attrs, ctrl, transclude) {
        var node = element[0];

        transclude(scope, function(nodes) {
          element.append(nodes);
        });

        if (isAnchorBtn(attrs)) {
          scope.$watch(attrs.ngDisabled, function(isDisabled) {
            element.attr('tabindex', isDisabled ? -1 : 0);
            if (isDisabled) {
              $animate.addClass(element, 'disabled');
            }
          });
        }

        if (attrs.ariaLabel === void 0) {
          element.attr('aria-label', node.textContent.trim());
        }

        //Setup up watcher for loader
        scope
        .$watch(function() {
          return scope.isLoading;
        }, 
        function(isLoading) {
          isLoading ? element.addClass('loading') : element.removeClass('loading');
        });
      }
    };

    function isAnchorBtn(attrs) {
      return attrs.href !== void 0 || attrs.ngHref !== void 0 || attrs.xlinkHref !== void 0;
    }

    function setTemplate(element, attrs) {
      if (isAnchorBtn(attrs)) {
        return '<a class="ui button"></a>';
      } else {
        return '<button class="ui button"></button>';
      }
    }
  }

})();
