(function () {
    'use strict';

    angular
        .module('semantic.ui.elements.flag', [])
        .directive('smFlag', smFlag);

    function smFlag($compile) {
        return {
            restrict: 'E',
            replace: true,
            scope: { value: '='},
            link: function (scope, element) {
                element.html('').append($compile('<i class="flag ' + scope.value + '"></i>')(scope));
            }
        }
    }

}());