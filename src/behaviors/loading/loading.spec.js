describe('Semantic-UI: Behaviors - smLoading', function() {
'use strict';

  var $scope, $compile;

  beforeEach(module('semantic.ui.behaviors.loading'));

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  it('has to be loading class if expression is true', function() {
    $scope.loading = true;
    var smLoading = $compile('<div class="ui segment" sm-loading="loading"></div>')($scope);
    $scope.$digest();

    expect(smLoading.hasClass('loading')).toBeTruthy();
  });

  it('does not have to be loading class if expression is false', function() {
    $scope.loading = false;
    var smLoading = $compile('<div class="ui segment" sm-loading="loading"></div>')($scope);
    $scope.$digest();

    expect(smLoading.hasClass('loading')).toBeFalsy();
  });
});
