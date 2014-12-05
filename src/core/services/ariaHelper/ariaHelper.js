(function() {
'use strict';

angular
  .module('semantic.ui.angular.core')

  .service('ariaHelper', ['$log', function($log) {

    return {
      hasAttribute: hasAttribute
    };

    function hasAttribute(node, attrName) {
      if (!node.hasAttribute(attrName)) {
        $log.warn('ngAria: Attribute "', attrName, '", required for accessibility, is missing on node:', node);
      }
    }
  }]);

})();
