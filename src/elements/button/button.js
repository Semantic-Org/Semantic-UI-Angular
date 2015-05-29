(function() {
'use strict';

angular
  .module('semantic.ui.elements.button', [])
  .directive('smButton', smButton)
  .directive('smButtons', smButtons);

  smButton.$inject = ['$animate'];

  function smButton($animate) {
    return {
      restrict:'E',
      replace: true,
      transclude: true,
      template: setTemplate,
      scope: {
        isLoading: '=loading',
        collection: '=collection'
      },
      link: function(scope, element, attrs, ctrl, transclude) {
        var node = element[0];

        transclude(scope, function(nodes) {
          element.append(nodes);
        });

        scope.$watch(attrs.ngDisabled, function(isDisabled) {
          if (isAnchorBtn(attrs)) {
            element.attr('tabindex', isDisabled ? -1 : 0);
          }
          if (isDisabled) {
            $animate.addClass(element, 'disabled');
          }
        });

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


  /**
   * @name smButtons
   * @description
   * # sm-buttons directive, for button group
   */ 
  function smButtons($animate, $compile) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: getTemplate,
      scope: false,
      link: function(scope, element, attrs, ctrl, transclude) {

        var node = element[0];
        transclude(scope, function(nodes) {
          element.append(nodes);
        });

        //Append conditional 'div' if exists.
        if(attrs.conditional) {
          var buttons = angular.element(node.querySelectorAll('.button'));
          var conditionalTemplate = getConditionalTemplate(attrs.conditional);
          for(var i = 0, length = (buttons.length - 1); i < length; i++) {
            if(angular.element(buttons[i]).hasClass('button')) {
              angular.element(buttons[i]).after(conditionalTemplate);
            }
          }
        }
      }
    }

    //get the conditional template.
    function getConditionalTemplate(text) {
      return '<div class="or" data-text="' + text + '"></div>';
    }

    //get the template for buttons group
    function getTemplate(element, attrs) {
      return '<div class="ui buttons"></div>';
    }
  }

})();
