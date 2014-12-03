describe('Semantic-UI: Elements - Button', function() {
'use strict';

  var $compile, $scope, element, buttons;

  beforeEach(module('semantic.ui.elements.button'));

  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $scope = _$rootScope_;
    $compile = _$compile_;
  }));

  function renderSemRadioBtn($scope) {
    element = angular.element([
      '<div class="ui buttons">',
        '<div class="ui button active" ng-model="model" sem-radio-btn="1">One</div>',
        '<div class="ui button active" ng-model="model" sem-radio-btn="2">Two</div>',
        '<div class="ui button active" ng-model="model" sem-radio-btn="3">Three</div>',
      '</div>'].join(''));

    $compile(element)($scope);
    $scope.$digest();
    return element;
  }

  function renderSemRadioBtnWithValues($scope) {
    element = angular.element([
      '<div class="ui buttons">',
        '<div class="ui button active" ng-model="model" sem-radio-btn="values[0]">One</div>',
        '<div class="ui button active" ng-model="model" sem-radio-btn="values[1]">Two</div>',
      '</div>'].join(''));

    $compile(element)($scope);
    $scope.$digest();
    return element;
  }

  function renderSemRadioBtnWithCustomClass($scope) {
    element = angular.element([
      '<div class="ui buttons">',
        '<div class="ui button active" ng-model="model" sem-radio-btn="1" sem-btn-class="\'custom\'">One</div>',
        '<div class="ui button active" ng-model="model" sem-radio-btn="2" sem-btn-class="\'custom\'">Two</div>',
      '</div>'].join(''));

    $compile(element)($scope);
    $scope.$digest();
    return element;
  }

  it('has to set active state according to the model value', function() {
    buttons = renderSemRadioBtn($scope);

    expect(buttons.find('.button').eq(0)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(1)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(2)).not.toHaveClass('active');

    $scope.model = 1;
    $scope.$digest();
    expect(buttons.find('.button').eq(0)).toHaveClass('active');
    expect(buttons.find('.button').eq(1)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(2)).not.toHaveClass('active');

    $scope.model = 3;
    $scope.$digest();
    expect(buttons.find('.button').eq(0)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(1)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(2)).toHaveClass('active');
  });

  it('has to update active state according to scope values', function() {
    $scope.values = ['val1', 'val2'];
    buttons = renderSemRadioBtnWithValues($scope);

    expect(buttons.find('.button').eq(0)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(1)).not.toHaveClass('active');

    $scope.model = 'val2';
    $scope.$digest();

    expect(buttons.find('.button').eq(0)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(1)).toHaveClass('active');

    $scope.values[0] = 'val3';
    $scope.model = 'val3';
    $scope.$digest();

    expect(buttons.find('.button').eq(0)).toHaveClass('active');
    expect(buttons.find('.button').eq(1)).not.toHaveClass('active');
  });

  it('has to set active state on click', function() {
    buttons = renderSemRadioBtn($scope);

    buttons.find('.button').eq(1).click();
    expect(buttons.find('.button').eq(0)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(1)).toHaveClass('active');
    expect(buttons.find('.button').eq(2)).not.toHaveClass('active');
    expect($scope.model).toBe(2);

    buttons.find('.button').eq(2).click();
    expect(buttons.find('.button').eq(0)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(1)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(2)).toHaveClass('active');
    expect($scope.model).toBe(3);
  });

  it('has to keep active state even if an element was clicked twice', function() {
    buttons = renderSemRadioBtn($scope);

    buttons.find('.button').eq(1).click();
    expect(buttons.find('.button').eq(0)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(1)).toHaveClass('active');
    expect(buttons.find('.button').eq(2)).not.toHaveClass('active');

    buttons.find('.button').eq(1).click();
    expect(buttons.find('.button').eq(0)).not.toHaveClass('active');
    expect(buttons.find('.button').eq(1)).toHaveClass('active');
    expect(buttons.find('.button').eq(2)).not.toHaveClass('active');
  });

  it('has to set custom "active" class if one was specified', function() {
    buttons = renderSemRadioBtnWithCustomClass($scope);

    buttons.find('.button').eq(0).click();
    expect(buttons.find('.button').eq(0)).toHaveClass('custom');
    expect(buttons.find('.button').eq(1)).not.toHaveClass('custom');

    buttons.find('.button').eq(1).click();
    expect(buttons.find('.button').eq(0)).not.toHaveClass('custom');
    expect(buttons.find('.button').eq(1)).toHaveClass('custom');
  });

});
