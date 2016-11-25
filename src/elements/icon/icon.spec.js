describe('Semantic-UI: Elements - smIcon', function() {
  'use strict';

  var $scope, $compile;

  beforeEach(module('semantic.ui.elements.icon'));

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  it('has to be font icon with classes user & icon', function() {
    var smIcon = $compile('<sm-icon sm-font-icon="user"></sm-icon>')($scope);
    $scope.$digest();
    expect(smIcon.find('i').hasClass('user')).toBe(true);
  });

});
