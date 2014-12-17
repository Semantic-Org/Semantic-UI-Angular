(function() {
  'use strict';

  angular
    .module('semantic.ui.elements.divider', [])

    .directive('smDivider', smDivider);

  function smDivider() {
    return {
      restrict:'E',
      replace: true,
      transclude: true,
      template: setTemplate,
      link: function(scope, element, attrs, ctrl, transclude) {

        transclude(scope, function(nodes) {
          element.append(nodes);
        });
      }
    };

    function hasType(attrs) {
      return attrs.vertical !== void 0 || attrs.horizontal !== void 0;
    }

    function setTemplate(element, attrs) {
      if (hasType(attrs)) {
        if(attrs.vertical !== void 0) {
          return '<div class="ui divider vertical"></div>';
        } else {
          return '<div class="ui divider horizontal"></div>';
        }
      } else {
        return '<div class="ui divider"></div>';
      }
    }
  }
})();
