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

  it('should support custom aria-label arribute', function() {
    var smCheckbox = $compile('<sm-checkbox aria-label="my lame checkbox" ' +
      'ng-model="opts.checked">Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(smCheckbox.attr('aria-label')).toBe('my lame checkbox');
  });

  it('should support fallback aria-label arribute', function() {
    var smCheckbox = $compile('<sm-checkbox ng-model="opts.checked">Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(smCheckbox.attr('aria-label')).toBe('Checkbox');
  });

  it('should support the \'toggle\' attribute', function() {
    var smCheckbox = $compile('<sm-checkbox toggle ng-model="opts.checked">Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(angular.element(smCheckbox[0]).hasClass('toggle')).toBeTruthy();
  });

  it('should support the \'slider\' attribute', function() {
    var smCheckbox = $compile('<sm-checkbox slider ng-model="opts.checked">Checkbox</sm-checkbox>')($scope);

    $scope.$digest();

    expect(angular.element(smCheckbox[0]).hasClass('slider')).toBeTruthy();
  });

  it('should honour ng-disabled', function() {
    var $newScope = $rootScope.$new();

    $newScope.opts = { 
      checked: true,
      disabled: false
    };

    var smCheckbox = $compile(
      '<sm-checkbox ng-model="opts.checked" ng-disabled="opts.disabled">Checkbox</sm-checkbox>'
    )($newScope);

    $newScope.$digest();

    expect(smCheckbox[0].children[0].disabled).toBeFalsy();

    $newScope.opts.disabled = true;

    $newScope.$digest();

    // trigger a click
    angular.element(smCheckbox[0].children[0]).click();

    $newScope.$digest();

    // inner checkbox should be disabled
    expect(smCheckbox[0].children[0].disabled).toBeTruthy();

    // ...and thus still checked
    expect(smCheckbox[0].children[0].checked).toBeTruthy();

  });

  it('should honour ng-model', function() {
    var $newScope = $rootScope.$new();

    $newScope.opts = { 
      checked: false
    };

    var smCheckbox = $compile('<sm-checkbox ng-model="opts.checked">Checkbox</sm-checkbox>')($newScope);
    $newScope.$digest();

    expect(smCheckbox[0].children[0].checked).toBeFalsy();

    $newScope.opts.checked = true;
    $newScope.$digest();

    expect(smCheckbox[0].children[0].checked).toBeTruthy();
  });

  it('should write \'checked\' change back to scope', function() {
    var $newScope = $rootScope.$new();
    $newScope.opts = { checked: false };
    var smCheckbox = $compile('<sm-checkbox ng-model="opts.checked">Checkbox</sm-checkbox>')($newScope);
    $newScope.$digest();

    expect(smCheckbox[0].children[0].checked).toBeFalsy();

    angular.element(smCheckbox[0]).click();

    $newScope.$digest();

    expect($newScope.opts.checked).toBeTruthy();
  });

  it('should tranclude an element transclusion directive', function() {
    var $newScope = $rootScope.$new();
    
    $newScope.opts = { checked: true };
    
    var smCheckbox = $compile('<sm-checkbox ng-model="opts.checked">' +
      '<div ng-if="opts.checked">Checked</div></sm-checkbox>')($newScope);

    $newScope.$digest();

    expect(smCheckbox.find('label').find('div').length).toBe(1);
  });

  it('should honour ng-repeat', function() {
    var $newScope = $rootScope.$new();
    
    $newScope.opts = { checked: true };
    $newScope.repeatLabels = ['first', 'second'];
    
    var smCheckbox = $compile('<div><sm-checkbox ng-repeat="label in repeatLabels" ng-model="opts.checked">' +
      '<div ng-if="opts.checked">{{label}}</div></sm-checkbox></div>')($newScope);

    $newScope.$digest();

    expect(smCheckbox.find('label')[0].textContent).toBe('first');
    expect(smCheckbox.find('label')[1].textContent).toBe('second');
  });

});
