///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
///<reference path="../../../typings/angularjs/angular-mocks.d.ts"/>

import { smButtonModule } from './button';

describe('smButton element', () => {
  'use strict';

  let $scope, $compile;

  beforeEach(angular.mock.module(smButtonModule.name));

  beforeEach(inject(($rootScope, $injector) => {
    $scope = $rootScope.$new();
    $compile = $injector.get('$compile');
  }));

  function getTagName(nodes) {
    return nodes[0].tagName.toLocaleLowerCase();
  }

  it('has to be anchor tag if there is a href attribute', () => {
    let smButton = $compile('<sm-button href=""></sm-button>')($scope);
    $scope.$digest();

    expect(getTagName(smButton)).toBe('a');
  });

  it('has to be anchor tag if there is a ng-href attribute', () => {
    let smButton = $compile('<sm-button ng-href=""></sm-button>')($scope);
    $scope.$digest();

    expect(getTagName(smButton)).toBe('a');
  });

  it('has to be anchor tag if there is a xlink:href attribute', () => {
    let smButton = $compile('<sm-button xlink:href=""></sm-button>')($scope);
    $scope.$digest();

    expect(getTagName(smButton)).toBe('a');
  });

  it('has to be button tag otherwise', ()  => {
    let smButton = $compile('<sm-button></sm-button>')($scope);
    $scope.$digest();

    expect(getTagName(smButton)).toBe('button');
  });

  it('has to add aria-label attribute with textContent if one was not provided', () => {
    let smButton = $compile('<sm-button>Button</sm-button>')($scope);
    $scope.$digest();

    expect(smButton[0].hasAttribute('aria-label')).toBe(true);
    expect(smButton.attr('aria-label')).toBe('Button');
  });

  it('has to support custom aria-label arribute', () => {
    let smButton = $compile('<sm-button aria-label="my cool button">Button</sm-button>')($scope);
    $scope.$digest();

    expect(smButton.attr('aria-label')).toBe('my cool button');
  });

  it('has to transclude textContent', () => {
    let smButton = $compile('<sm-button>Button</sm-button>')($scope);
    $scope.$digest();

    expect(smButton.text()).toBe('Button');
  });

  it('does not have to create sibling scope', () => {
    let smButton = $compile('<sm-button>Button</sm-button>')($scope);
    $scope.$digest();

    expect($scope).toBe(smButton.scope());
  });
});
