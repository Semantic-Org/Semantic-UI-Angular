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

const accordionSettings: ISmAccordionSettings = {
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
  accordionGroups = [];

  constructor(public $scope: ng.IScope, public $element: ng.IAugmentedJQuery, public $attrs) {

  }
  
  addGroup = function (element) {
    this.accordionGroups.push(element);
  }
  setActive = function (title) {
    
    var content = this.accordionGroups[this.accordionGroups.indexOf(title) + 1];

    if (content && content.hasClass('content')) {      
      content.toggleClass('active');
    }
    title.toggleClass('active');

    if (accordionSettings.exclusive) {
      this.accordionGroups.forEach(e => {
        if (e != title && e != content)
          e.removeClass('active')
      });
    }
  }
}

class SmAccordionDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmAccordionDirective;
  }

  restrict = 'E';
  controller = SmAccordionController;
  controllerAs = 'accordion';
  replace = true;
  transclude = true;
  template = '<div class="ui styled accordion"><div ng-transclude></div></div>';
  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery,
    attrs
  ) => {
    
  };
}

class SmAccordionTitleDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmAccordionTitleDirective;
  }

  restrict = 'E';
  replace = true;
  transclude = true;
  require = '^smAccordion';

  template = '<div class="title"><i class="dropdown icon"></i><span ng-transclude></span></div>';

  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery,
    attrs,
    ctrl
  ) => {
    ctrl.addGroup(element);

    element.bind('click', () => {
      ctrl.setActive(element);
    });

  };
}

class SmAccordionContentDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmAccordionContentDirective;
  }

  restrict = 'E';
  replace = true;
  transclude = true;
  require = '^smAccordion';

  template = '<div class="content"><div ng-transclude></div></div>';
  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery,
    attrs,
    ctrl
  ) => {
    ctrl.addGroup(element);
  };
}


export const smAccordionModule = angular
  .module('semantic.ui.modules.accordion', [])
  .directive('smAccordion', SmAccordionDirective.instance)
  .directive('smAccordionTitle', SmAccordionTitleDirective.instance)
  .directive('smAccordionContent', SmAccordionContentDirective.instance)
  .constant('smAccordionSettings', accordionSettings);
