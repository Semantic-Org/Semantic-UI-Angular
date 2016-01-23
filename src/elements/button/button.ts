///<reference path="../../../typings/angularjs/angular.d.ts"/>
///<reference path="../../../typings/angularjs/angular-animate.d.ts"/>

'use strict';

class SmButtonController {
  static $inject = ['$animate'];

  constructor(public $animate: ng.IAnimateProvider) { }

}

class SmButtonDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmButtonDirective;
  }

  restrict = 'E';
  replace = true;
  transclude = true;
  template = this.setTemplate;
  controller = SmButtonController;

  isAnchorBtn(attrs) {
    return attrs.href !== void 0 || attrs.ngHref !== void 0 || attrs.xlinkHref !== void 0;
  }

  setTemplate(element: ng.IAugmentedJQuery, attrs): string {
    if (this.isAnchorBtn(attrs)) {
      return '<a class="ui button"></a>';
    } else {
      return '<button class="ui button"></button>';
    }
  }

  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery,
    attrs,
    ctrl,
    transclude: ng.ITranscludeFunction
  ) => {
    let node = element[0];

    transclude(scope, (nodes) => {
      element.append(nodes);
    });

    if (this.isAnchorBtn(attrs)) {
      scope.$watch(attrs.ngDisabled, function(isDisabled: boolean) {
        element.attr('tabindex', isDisabled ? -1 : 0);
        if (isDisabled) {
          ctrl.$animate.addClass(element, 'disabled');
        }
      });
    }

    if (attrs.ariaLabel === void 0) {
      element.attr('aria-label', node.textContent.trim());
    }

    scope.$watch(attrs.ngDisabled, function(isDisabled) {
      if (isDisabled) {
        ctrl.$animate.addClass(element, 'disabled');
      }
    });

    element.on('$destroy', function() {
      scope.$destroy();
    });
  };
}

export var smButtonModule: ng.IModule = angular
  .module('semantic.ui.elements.button', [])
  .directive('smButton', SmButtonDirective.instance);
