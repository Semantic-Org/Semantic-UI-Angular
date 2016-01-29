///<reference path="../../../../typings/angularjs/angular.d.ts"/>

'use strict';

export class SmAlignRightDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmAlignRightDirective;
  }

  restrict = 'A';
  replace = true;

  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery
  ) => {

    element.addClass('right floated');
  };
}
