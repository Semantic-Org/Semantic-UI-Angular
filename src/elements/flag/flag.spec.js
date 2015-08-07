describe('Semantic-UI: Elements - smFlag', function () {
    'use strict';

    var $scope, $compile;

    beforeEach(module('semantic.ui.elements.flag'));

    beforeEach(inject(function ($rootScope, _$compile_) {
        $scope = $rootScope.$new();
        $compile = _$compile_;
    }));

    it('has to be able to be a flag by country name', function () {
        var smFlag = $compile('<sm-flag value="\'china\'"></sm-flag>')($scope);
        $scope.$digest();
        expect(smFlag.find('i').hasClass('china')).toBe(true);
        expect(smFlag.find('i').hasClass('flag')).toBe(true);
    });

    it('has to be able to be a flag by iso code ', function () {
        var smFlag = $compile('<sm-flag value="\'jp\'"></sm-flag>')($scope);
        $scope.$digest();
        expect(smFlag.find('i').hasClass('jp')).toBe(true);
        expect(smFlag.find('i').hasClass('flag')).toBe(true);
    });

    it('has to be able to be a flag by common name ', function () {
        var smFlag = $compile('<sm-flag value="\'america\'"></sm-flag>')($scope);
        $scope.$digest();
        expect(smFlag.find('i').hasClass('america')).toBe(true);
        expect(smFlag.find('i').hasClass('flag')).toBe(true);
    });

});
