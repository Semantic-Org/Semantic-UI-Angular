describe('Semantic-UI: Elements - smDivider', function() {
  'use strict';

  var $scope, $compile;

  beforeEach(module('semantic.ui.elements.divider'));

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  it('has to be able to be defined as vertical', function() {
    var smDivider = $compile('<sm-divider vertical></sm-divider>')($scope);

    expect(smDivider.hasClass('vertical')).toBe(true);
  });

  it('has to be able to be defined as horizontal', function() {
    var smDivider = $compile('<sm-divider horizontal></sm-divider>')($scope);

    expect(smDivider.hasClass('horizontal')).toBe(true);
  });

});
