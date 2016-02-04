///<reference path="../../../typings/angularjs/angular.d.ts"/>

'use strict';

class SmCheckboxDirective implements ng.IDirective {

  static instance(): ng.IDirective {
    return new SmCheckboxDirective();
  }

  restrict = 'E';
  require = '?ngModel';
  transclude = true;
  replace = true;
  template=  '<div class="ui checkbox">' +
              '<input type="checkbox">' +
              '<label></label>' +
            '</div>';

  link = (scope, element, attrs, ngModel, transclude) => {
    let checked = false;
    let disabled = false;
    let input = element.find('input');

    transclude(scope, (nodes) => {
      element.find('label').append(nodes);
    });

    element.on('click', toggleFn);

    if (!ngModel) {
      throw new Error('Semantic-UI-Angular: The \'smCheckbox\' directive requires a \'ng-model\' value');
    }

    ngModel.$render = () => {
      checked = ngModel.$viewValue;
      input.prop('checked', checked);
    };

    scope.$watch(attrs.ngDisabled, (val: boolean) => {
      disabled = val || false;
      input.attr('disabled', disabled);
    });

    if (attrs.toggle !== void 0) {
      element.addClass('toggle');
    } else if (attrs.slider !== void 0) {
      element.addClass('slider');
    }

    if (attrs.ariaLabel === void 0) {
      element.attr('aria-label', element[0].textContent.trim());
    }

    function toggleFn() {
      if (disabled) { return; }

      checked = !checked;
      input.prop('checked', checked);
      ngModel.$setViewValue(checked);
      scope.$apply();
    }
  };
}

export var smCheckboxModule: ng.IModule = angular
  .module('semantic.ui.modules.checkbox', [])
  .directive('smCheckbox', SmCheckboxDirective.instance);
