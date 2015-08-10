(function () {
    'use strict';

    angular
        .module('semantic.ui.elements.flag', [])
        .directive('smFlag', smFlag);

    function smFlag() {
        return {
            restrict: 'E',
            scope: { value: '@' },
            template: '<i class="flag {{value}}"></i>'
        }
    }

}());