///<reference path="../../../typings/angularjs/angular.d.ts"/>
///<reference path="../../../typings/angularjs/angular-animate.d.ts"/>
'use strict';
var SmButtonController = (function () {
    function SmButtonController($animate) {
        this.$animate = $animate;
    }
    SmButtonController.$inject = ['$animate'];
    return SmButtonController;
})();
var SmButtonDirective = (function () {
    function SmButtonDirective() {
        var _this = this;
        this.restrict = 'E';
        this.replace = true;
        this.transclude = true;
        this.template = this.setTemplate;
        this.controller = SmButtonController;
        this.link = function (scope, element, attrs, ctrl, transclude) {
            var node = element[0];
            transclude(scope, function (nodes) {
                element.append(nodes);
            });
            if (_this.isAnchorBtn(attrs)) {
                scope.$watch(attrs.ngDisabled, function (isDisabled) {
                    element.attr('tabindex', isDisabled ? -1 : 0);
                    if (isDisabled) {
                        ctrl.$animate.addClass(element, 'disabled');
                    }
                });
            }
            if (attrs.ariaLabel === void 0) {
                element.attr('aria-label', node.textContent.trim());
            }
            scope.$watch(attrs.ngDisabled, function (isDisabled) {
                if (isDisabled) {
                    ctrl.$animate.addClass(element, 'disabled');
                }
            });
            element.on('$destroy', function () {
                scope.$destroy();
            });
        };
    }
    SmButtonDirective.instance = function () {
        return new SmButtonDirective;
    };
    SmButtonDirective.prototype.isAnchorBtn = function (attrs) {
        return attrs.href !== void 0 || attrs.ngHref !== void 0 || attrs.xlinkHref !== void 0;
    };
    SmButtonDirective.prototype.setTemplate = function (element, attrs) {
        if (this.isAnchorBtn(attrs)) {
            return '<a class="ui button"></a>';
        }
        else {
            return '<button class="ui button"></button>';
        }
    };
    return SmButtonDirective;
})();
exports.smButtonModule = angular
    .module('semantic.ui.elements.button', [])
    .directive('smButton', SmButtonDirective.instance);
