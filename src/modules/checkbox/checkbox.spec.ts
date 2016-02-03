///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
///<reference path="../../../typings/angularjs/angular-mocks.d.ts"/>

import { smCheckboxModule } from './checkbox';

describe('Semantic-UI: Components - smCheckbox', () => {
  'use strict';

  let $scope, $compile;

  beforeEach(angular.mock.module(smCheckboxModule.name));

  beforeEach(inject(function($rootScope, $injector) {
    $scope = $rootScope.$new();
    $compile = $injector.get('$compile');
  }));

  it('should transclude the text content', () => {
    let smCheckbox = $compile('<sm-checkbox ng-model="test">Checkbox</sm-checkbox>')($scope);
    $scope.$digest();
    expect(smCheckbox.text()).toBe('Checkbox');
  });

  it('should support custom aria-label arribute', () => {
    let smCheckbox = $compile('<sm-checkbox aria-label="my lame checkbox" ' +
      'ng-model="opts.checked">Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(smCheckbox.attr('aria-label')).toBe('my lame checkbox');
  });

  it('should support fallback aria-label arribute', () => {
    let smCheckbox = $compile('<sm-checkbox ng-model="opts.checked">Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(smCheckbox.attr('aria-label')).toBe('Checkbox');
  });

  it('should support the \'toggle\' attribute', () => {
    let smCheckbox = $compile('<sm-checkbox toggle ng-model="opts.checked">Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(angular.element(smCheckbox[0]).hasClass('toggle')).toBeTruthy();
  });

  it('should support the \'slider\' attribute', () => {
    let smCheckbox = $compile('<sm-checkbox slider ng-model="opts.checked">Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(angular.element(smCheckbox[0]).hasClass('slider')).toBeTruthy();
  });

  it('should honour ng-disabled', () => {
    $scope.opts = {
      checked: true,
      disabled: false
    };

    let smCheckbox = $compile(
      '<sm-checkbox ng-model="opts.checked" ng-disabled="opts.disabled">Checkbox</sm-checkbox>'
    )($scope);

    $scope.$digest();

    expect(smCheckbox[0].children[0].disabled).toBeFalsy();

    $scope.opts.disabled = true;

    $scope.$digest();

    // trigger a click
    angular.element(smCheckbox[0].children[0]).click();

    $scope.$digest();

    // inner checkbox should be disabled
    expect(smCheckbox[0].children[0].disabled).toBeTruthy();

    // ...and thus still checked
    expect(smCheckbox[0].children[0].checked).toBeTruthy();

  });

  it('should honour ng-model', () => {
    $scope.opts = {
      checked: false
    };

    let smCheckbox = $compile('<sm-checkbox ng-model="opts.checked">Checkbox</sm-checkbox>')($scope);
    $scope.$digest();

    expect(smCheckbox[0].children[0].checked).toBeFalsy();

    $scope.opts.checked = true;
    $scope.$digest();

    expect(smCheckbox[0].children[0].checked).toBeTruthy();
  });

  it('should write \'checked\' change back to scope', () => {
    $scope.opts = { checked: false };
    let smCheckbox = $compile('<sm-checkbox ng-model="opts.checked">Checkbox</sm-checkbox>')($scope);
    $scope.$digest();

    expect(smCheckbox[0].children[0].checked).toBeFalsy();

    angular.element(smCheckbox[0]).click();

    $scope.$digest();

    expect($scope.opts.checked).toBeTruthy();
  });

  it('should tranclude an element transclusion directive', () => {
    $scope.opts = { checked: true };

    let smCheckbox = $compile('<sm-checkbox ng-model="opts.checked">' +
      '<div ng-if="opts.checked">Checked</div></sm-checkbox>')($scope);

    $scope.$digest();

    expect(smCheckbox.find('label').find('div').length).toBe(1);
  });

  it('should honour ng-repeat', () => {
    $scope.opts = { checked: true };
    $scope.repeatLabels = ['first', 'second'];

    let smCheckbox = $compile('<div><sm-checkbox ng-repeat="label in repeatLabels" ng-model="opts.checked">' +
      '<div ng-if="opts.checked">{{label}}</div></sm-checkbox></div>')($scope);

    $scope.$digest();

    expect(smCheckbox.find('label')[0].textContent).toBe('first');
    expect(smCheckbox.find('label')[1].textContent).toBe('second');
  });

});
