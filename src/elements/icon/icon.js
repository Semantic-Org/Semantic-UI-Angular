(function() {
  'use strict';

  angular
  .module('semantic.ui.elements.icon', [])
  .directive('smIcon', smIcon);


  function smIcon() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        fontIcon: '@smFontIcon',
        iconSize: '@smIconSize'
      },
      template: getTemplate,
      link: function(scope, element, attrs, ctrl, transclude) {
        var node = element[0];

        transclude(scope, function(nodes) {
          element.append(nodes);
        });

        //Adding base icon class, if it is not mentioned explicitly.
        scope.fontIcon = scope.fontIcon && scope.fontIcon.indexOf('icon') <= -1 ? scope.fontIcon + ' icon' : scope.fontIcon;
        element.addClass(scope.fontIcon);

        //Check if the icon size is specified
        if(scope.iconSize) {
          element.css('font-size', scope.iconSize);
        }
      }
    }
  }

  function getTemplate(element, attr) {
    return attr.smFontIcon ? '<i class="sm-font"></i>' : '';
  }

})();