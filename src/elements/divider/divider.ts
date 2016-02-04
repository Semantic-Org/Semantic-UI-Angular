///<reference path="../../../typings/angularjs/angular.d.ts"/>

'use strict';

class SmDividerDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmDividerDirective;
  }

  restrict = 'E';
  replace = true;
  transclude = true;
  template = this.setTemplate;

  hasType(attrs) {
    return attrs.vertical !== void 0 || attrs.horizontal !== void 0;
  }

  setTemplate(element: ng.IAugmentedJQuery, attrs): string {

    if (this.hasType(attrs)) {
      if (attrs.vertical !== void 0) {
        return '<div class="ui divider vertical"></div>';
      } else {
        return '<div class="ui divider horizontal"></div>';
      }
    } else {
      return '<div class="ui divider"></div>';
    }
  }

  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery,
    attrs,
    ctrl,
    transclude: ng.ITranscludeFunction
  ) => {

    transclude(scope, (nodes) => {
      element.append(nodes);
    });
  };
}


export var smDividerModule: ng.IModule = angular
  .module('semantic.ui.elements.divider', [])
  .directive('smDivider', SmDividerDirective.instance);
