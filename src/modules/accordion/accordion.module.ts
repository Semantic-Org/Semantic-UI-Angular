///<reference path="../../../typings/angularjs/angular.d.ts"/>

'use strict';

interface ISmAccordionSettings {
    exclusive: Boolean,
    on: String,
    animateChildren: Boolean,
    closeNested: Boolean,
    collapsible: Boolean,
    duration: Number,
    easing: String
}

const accordionSettings : ISmAccordionSettings = {
  exclusive: true,
  on: 'click',
  animateChildren: true,
  closeNested: true,
  collapsible: true,
  duration: 500,
  easing: 'easeInOutQuint'
};

class SmAccordionController {
  static $inject = ['$scope', '$element', '$attrs'];

  ngModel: ng.INgModelController;

  constructor(public $scope: ng.IScope, public $element: ng.IAugmentedJQuery, public $attrs) {
    $element
      .addClass('ui styled accordion');
     
  }
}

class SmAccordionDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmAccordionDirective;
  }

  restrict = 'E';
  controller = SmAccordionController;
  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery,
    attrs
  ) => {
    // const [controller, ngModel] = ctrls;
    // controller.init(ngModel);
  };
}

class SmAccordionTitleDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmAccordionTitleDirective;
  }

  restrict = 'E';
  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery,
    attrs
  ) => {
      element.addClass('title');
      // element.bind('click', () => element.toggleClass('active'))
  };
}

class SmAccordionContentDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmAccordionContentDirective;
  }

  restrict = 'E';
  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery,
    attrs
  ) => {
      element.addClass('content');
  };
}


export const smAccordionModule = angular
  .module('semantic.ui.modules.accordion', [])
  .directive('smAccordion', SmAccordionDirective.instance)
  .directive('smAccordionItem', SmAccordionDirective.instance)
  .directive('smAccordionTitle', SmAccordionTitleDirective.instance)
  .directive('smAccordionContent', SmAccordionContentDirective.instance)
  .constant('smAccordionSettings', accordionSettings);
