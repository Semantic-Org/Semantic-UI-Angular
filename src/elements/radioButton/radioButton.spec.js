describe('Semantic-UI: Elements - smRadioButton', function() {
  'use strict';

  var $scope, $compile, html;

  beforeEach(module('semantic.ui.elements.radioButton'));

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  function renderRadioBtns($scope) {
    html = angular.element([
      '<sm-radio-group ng-model="radio.value">',
        '<sm-radio-button value="1">One</sm-radio-button>',
        '<sm-radio-button value="2">Two</sm-radio-button>',
        '<sm-radio-button value="3">Three</sm-radio-button>',
      '</sm-radio-group>'].join('')
    );

    $compile(html)($scope);
    $scope.$digest();

    return html;
  }

  it('has to bind model value to UI on init', function() {
    $scope.radio = {value: 2};
    var html = renderRadioBtns($scope);
    var radioBtns = html.find('.button');

    expect(radioBtns.eq(0).hasClass('active')).toBe(false);
    expect(radioBtns.eq(1).hasClass('active')).toBe(true);
    expect(radioBtns.eq(2).hasClass('active')).toBe(false);
  });

  it('has to bind UI value to model on click event', function() {
    var html = renderRadioBtns($scope);
    var radioBtns = html.find('.button');
    $scope.radio = {};

    expect($scope.radio.value).toBeUndefined();

    expect(radioBtns.eq(0).hasClass('active')).toBe(false);
    expect(radioBtns.eq(0).hasClass('active')).toBe(false);

    radioBtns.eq(0).triggerHandler('click');
    expect($scope.radio.value).toBe('1');
  });

  it('has to keep model value when the same element was clicked again', function() {
    $scope.radio = {value: 2};
    var html = renderRadioBtns($scope);
    var radioBtns = html.find('.button');

    expect($scope.radio.value).toBe(2);

    radioBtns.eq(1).triggerHandler('click');
    expect($scope.radio.value).toBe('2');

    radioBtns.eq(1).triggerHandler('click');
    expect($scope.radio.value).toBe('2');
  });

  it('has to be able to support disabled radio buttons', function() {
    $scope.radio = {value: 2};
    var html = renderRadioBtns($scope);
    var radioBtns = html.find('.button');

    expect($scope.radio.value).toBe(2);

    radioBtns.eq(0).attr('disabled', true);
    radioBtns.eq(0).triggerHandler('click');
    expect($scope.radio.value).toBe(2);
  });
});
