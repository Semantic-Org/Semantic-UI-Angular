describe('Semantic-UI: Elements - smButton', function() {
'use strict';

  var $scope, $compile;

  beforeEach(module('semantic.ui.elements.button'));

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  function getTagName(nodes) {
    return nodes[0].tagName.toLocaleLowerCase();
  }

  it('has to be anchor tag if there is a href attribute', function() {
    var smButton = $compile('<sm-button href=""></sm-button>')($scope);
    $scope.$digest();

    expect(getTagName(smButton)).toBe('a');
  });

  it('has to be anchor tag if there is a ng-href attribute', function() {
    var smButton = $compile('<sm-button ng-href=""></sm-button>')($scope);
    $scope.$digest();

    expect(getTagName(smButton)).toBe('a');
  });

  it('has to be anchor tag if there is a xlink:href attribute', function() {
    var smButton = $compile('<sm-button xlink:href=""></sm-button>')($scope);
    $scope.$digest();

    expect(getTagName(smButton)).toBe('a');
  });

  it('has to be button tag otherwise', function() {
    var smButton = $compile('<sm-button></sm-button>')($scope);
    $scope.$digest();

    expect(getTagName(smButton)).toBe('button');
  });

  it('has to add aria-label attribute with textContent if one was not provided', function() {
    var smButton = $compile('<sm-button>Button</sm-button>')($scope);
    $scope.$digest();

    expect(smButton[0].hasAttribute('aria-label')).toBe(true);
    expect(smButton.attr('aria-label')).toBe('Button');
  });

  it('has to support custom aria-label arribute', function() {
    var smButton = $compile('<sm-button aria-label="my cool button">Button</sm-button>')($scope);
    $scope.$digest();

    expect(smButton.attr('aria-label')).toBe('my cool button');
  });

  it('has to transclude textContent', function() {
    var smButton = $compile('<sm-button>Button</sm-button>')($scope);
    $scope.$digest();

    expect(smButton.text()).toBe('Button');
  });

  it('does not have to create sibling scope', function() {
    var smButton = $compile('<sm-button>Button</sm-button>')($scope);
    $scope.$digest();

    expect($scope).toBe(smButton.scope());
  });
});
