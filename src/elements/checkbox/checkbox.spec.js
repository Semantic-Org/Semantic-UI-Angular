describe('Semantic-UI: Elements - smCheckbox', function() {
  'use strict';

  var $scope, $compile, $rootScope;

  beforeEach(module('semantic.ui.elements.checkbox'));

  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  it('should transclude the text content', function() {
    var smCheckbox = $compile('<sm-checkbox ng-model="test">Checkbox</sm-checkbox>')($scope);
    $scope.$digest();
    expect(smCheckbox.text()).toBe('Checkbox');
  });

  it('should work without `ng-model` set', function() {
    $compile('<sm-checkbox>Checkbox</sm-checkbox>')($scope);
    $scope.$digest();
  });

  it('should support custom aria-label arribute', function() {
    var smCheckbox = $compile('<sm-checkbox aria-label="my lame checkbox">Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(smCheckbox.attr('aria-label')).toBe('my lame checkbox');
  });

  it('should support fallback aria-label arribute', function() {
    var smCheckbox = $compile('<sm-checkbox>Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(smCheckbox.attr('aria-label')).toBe('Checkbox');
  });

  it('should support the \'toggle\' attribute', function() {
    var smCheckbox = $compile('<sm-checkbox toggle>Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(angular.element(smCheckbox[0].children[0]).hasClass('toggle')).toBeTruthy();
  });

  it('should support the \'slider\' attribute', function() {
    var smCheckbox = $compile('<sm-checkbox slider>Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(angular.element(smCheckbox[0].children[0]).hasClass('slider')).toBeTruthy();
  });

  it('should honour ng-disabled', function() {
    var $newScope = $rootScope.$new();

    $newScope.isChecked = true;

    var smCheckbox = $compile(
      '<sm-checkbox ng-model="isChecked" ng-disabled="isDisabled">Checkbox</sm-checkbox>'
    )($newScope);

    $newScope.$digest();

    expect(smCheckbox[0].children[0].children[0].disabled).toBeFalsy();

    $newScope.isDisabled = true;

    $newScope.$digest();

    // trigger a click
    angular.element(smCheckbox[0].children[0]).click();

    $newScope.$digest();

    // inner checkbox should be disabled
    expect(smCheckbox[0].children[0].children[0].disabled).toBeTruthy();

    // ...and thus still checked
    expect(smCheckbox[0].children[0].children[0].checked).toBeTruthy();

  });

  it('should honour ng-model', function() {
    var $newScope = $rootScope.$new();
    var smCheckbox = $compile('<sm-checkbox ng-model="isChecked">Checkbox</sm-checkbox>')($newScope);
    $newScope.$digest();

    expect(smCheckbox[0].children[0].children[0].checked).toBeFalsy();

    $newScope.isChecked = true;
    $newScope.$digest();

    expect(smCheckbox[0].children[0].children[0].checked).toBeTruthy();
  });

});
