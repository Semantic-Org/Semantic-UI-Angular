(function() {
  'use strict';

  angular
  .module('semantic.ui.elements.icon', [])
  .directive('smIcon', smIcon);


  function smIcon() {
    return {
      restrict: 'EA',
      scope: {
        fontIcon: '@smFontIcon'
      },
      template: getTemplate,
      link: function(scope, element, attrs, ctrl) {
        if(scope.fontIcon) {
          element.find('i').addClass(scope.fontIcon)
        } else {
          console.warn('sm-font-icon is not provided');
        }
      }
    }
  }

  function getTemplate(element, attr) {
    return attr.smFontIcon ? '<i class="sm-font icon"></i>' : '';
  }

})(angular);