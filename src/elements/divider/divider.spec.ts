///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
///<reference path="../../../typings/angularjs/angular-mocks.d.ts"/>

import { smDividerModule } from './divider';

describe('smDivider element', () => {
  'use strict';

  let $scope, $compile;

  beforeEach(angular.mock.module(smDividerModule.name));

  beforeEach(inject(($rootScope, $injector) => {
    $scope = $rootScope.$new();
    $compile = $injector.get('$compile');
  }));


  it('has to be able to be defined as vertical', () => {
    let smDivider = $compile('<sm-divider vertical></sm-divider>')($scope);
    $scope.$digest();

    expect(smDivider.hasClass('vertical')).toBe(true);
  });

  it('has to be able to be defined as horizontal', () => {
    let smDivider = $compile('<sm-divider horizontal></sm-divider>')($scope);
    $scope.$digest();

    expect(smDivider.hasClass('horizontal')).toBe(true);
  });

  it('has to transclude textContent', () => {
    let smDivider = $compile('<sm-divider>or</sm-divider>')($scope);
    $scope.$digest();

    expect(smDivider.text()).toBe('or');
  });

  it('does not have to create sibling scope', () => {
    let smDivider = $compile('<sm-divider vertical>or</sm-divider>')($scope);
    $scope.$digest();

    expect($scope).toBe(smDivider.scope());
  });
});
