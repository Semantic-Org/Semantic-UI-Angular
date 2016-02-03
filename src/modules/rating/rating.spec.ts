///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
///<reference path="../../../typings/angularjs/angular-mocks.d.ts"/>

import { smRatingModule } from './rating';

describe('Semantic-UI: Components - smRating', function() {
  'use strict';

  let $scope, $compile, element;

  beforeEach(angular.mock.module(smRatingModule.name));

  beforeEach(inject(function($rootScope, $injector) {
    $scope = $rootScope.$new();
    $compile = $injector.get('$compile');
    $scope.rate = 3;
    element = $compile('<sm-rating ng-model="rate"></sm-rating>')($scope);
    $scope.$digest();
  }));

  function getStars() {
    return element.find('i');
  }

  function getStar(number) {
    return getStars().eq( number - 1 );
  }

  function getState(className, classDefault) {
    let stars = getStars();
    let state = [];
    for (let i = 0, n = stars.length; i < n; i++) {
      state.push(stars.eq(i).hasClass(className || classDefault));
    }
    return state;
  }

  function getStateActive(classActive?) {
    return getState(classActive, 'active');
  }

  function getStateHover(classHover?, classHoverParent?) {
    let classDefault = 'selected';
    return getState(classHover, classDefault).concat([element.hasClass(classHoverParent || classDefault)]);
  }

  function triggerKeyDown(keyCode) {
    let e = $.Event('keydown');
    e.which = keyCode;
    element.trigger(e);
  }

  it('contains the default number of icons', function() {
    expect(getStars().length).toBe(5);
    expect(element.attr('aria-valuemax')).toBe('5');
  });

  it('use star icons as default icons', function() {
    expect(element.hasClass('star')).toBe(true);
  });

  it('initializes the default star icons as selected', function() {
    expect(getStateActive()).toEqual([true, true, true, false, false]);
    expect(element.attr('aria-valuenow')).toBe('3');
  });

  it('handles correctly the click event', function() {
    getStar(2).click();
    $scope.$digest();
    expect(getStateActive()).toEqual([true, true, false, false, false]);
    expect($scope.rate).toBe(2);
    expect(element.attr('aria-valuenow')).toBe('2');

    getStar(5).click();
    $scope.$digest();
    expect(getStateActive()).toEqual([true, true, true, true, true]);
    expect($scope.rate).toBe(5);
    expect(element.attr('aria-valuenow')).toBe('5');
  });

  it('handles correctly the hover event', function() {
    getStar(2).trigger('mouseover');
    $scope.$digest();
    expect(getStateHover()).toEqual([true, true, false, false, false, true]);
    expect($scope.rate).toBe(3);

    getStar(5).trigger('mouseover');
    $scope.$digest();
    expect(getStateHover()).toEqual([true, true, true, true, true, true]);
    expect($scope.rate).toBe(3);

    element.trigger('mouseout');
    expect(getStateHover()).toEqual([false, false, false, false, false, false]);
    expect($scope.rate).toBe(3);
  });

  it('rounds off the number of stars shown with decimal values', function() {
    $scope.rate = 2.1;
    $scope.$digest();

    expect(getStateActive()).toEqual([true, true, false, false, false]);
    expect(element.attr('aria-valuenow')).toBe('2');

    $scope.rate = 2.5;
    $scope.$digest();

    expect(getStateActive()).toEqual([true, true, true, false, false]);
    expect(element.attr('aria-valuenow')).toBe('3');
  });

  it('changes the number of selected icons when value changes', function() {
    $scope.rate = 2;
    $scope.$digest();

    expect(getStateActive()).toEqual([true, true, false, false, false]);
    expect(element.attr('aria-valuenow')).toBe('2');
  });

  it('shows different number of icons when `max` attribute is set', function() {
    element = $compile('<sm-rating ng-model="rate" max="7"></sm-rating>')($scope);
    $scope.$digest();

    expect(getStars().length).toBe(7);
    expect(element.attr('aria-valuemax')).toBe('7');
  });

  it('shows different number of icons when `max` attribute is from scope variable', function() {
    $scope.max = 15;
    element = $compile('<sm-rating ng-model="rate" max="max"></sm-rating>')($scope);
    $scope.$digest();
    expect(getStars().length).toBe(15);
    expect(element.attr('aria-valuemax')).toBe('15');
  });

  it('handles readonly attribute', function() {
    $scope.isReadonly = true;
    element = $compile('<sm-rating ng-model="rate" readonly="isReadonly"></sm-rating>')($scope);
    $scope.$digest();

    expect(getStateActive()).toEqual([true, true, true, false, false]);

    let star5 = getStar(5);
    star5.trigger('mouseover');
    $scope.$digest();
    expect(getStateActive()).toEqual([true, true, true, false, false]);
    expect(getStateHover()).toEqual([false, false, false, false, false, false]);

    $scope.isReadonly = false;
    $scope.$digest();

    star5.trigger('mouseover');
    $scope.$digest();
    expect(getStateHover()).toEqual([true, true, true, true, true, true]);
  });

  it('should fire onHover', function() {
    $scope.hoveringOver = jasmine.createSpy('hoveringOver');
    element = $compile('<sm-rating ng-model="rate" on-hover="hoveringOver(value)"></sm-rating>')($scope);
    $scope.$digest();

    getStar(3).trigger('mouseover');
    $scope.$digest();
    expect($scope.hoveringOver).toHaveBeenCalledWith(3);
  });

  it('should fire onLeave', function() {
    $scope.leaving = jasmine.createSpy('leaving');
    element = $compile('<sm-rating ng-model="rate" on-leave="leaving()"></sm-rating>')($scope);
    $scope.$digest();

    element.trigger('mouseleave');
    $scope.$digest();
    expect($scope.leaving).toHaveBeenCalled();
  });

  describe('keyboard navigation', function() {
    it('supports arrow keys', function() {
      triggerKeyDown(38);
      expect($scope.rate).toBe(4);

      triggerKeyDown(37);
      expect($scope.rate).toBe(3);
      triggerKeyDown(40);
      expect($scope.rate).toBe(2);

      triggerKeyDown(39);
      expect($scope.rate).toBe(3);
    });

    it('supports only arrow keys', function() {
      $scope.rate = undefined;
      $scope.$digest();

      triggerKeyDown(36);
      expect($scope.rate).toBe(undefined);

      triggerKeyDown(41);
      expect($scope.rate).toBe(undefined);
    });

    it('can get zero value but not negative', function() {
      $scope.rate = 1;
      $scope.$digest();

      triggerKeyDown(37);
      expect($scope.rate).toBe(0);

      triggerKeyDown(37);
      expect($scope.rate).toBe(0);
    });

    it('cannot get value above max', function() {
      $scope.rate = 4;
      $scope.$digest();

      triggerKeyDown(38);
      expect($scope.rate).toBe(5);

      triggerKeyDown(38);
      expect($scope.rate).toBe(5);
    });
  });

  describe('custom states', function() {
    beforeEach(inject(function() {
      $scope.classActive = 'foo-active';
      $scope.classHover = 'foo-hover';
      $scope.classHoverParent = 'foo-hover-parent';
      element = $compile(`
        <sm-rating ng-model="rate" state-active="classActive" state-hover="classHover" state-hover-parent="classHoverParent">
        </sm-rating>
      `)($scope);
      $scope.$digest();
    }));

    it('changes the default icons', function() {
      expect(getStateActive($scope.classActive)).toEqual([true, true, true, false, false]);
      getStar(3).trigger('mouseover');
      expect(getStateHover($scope.classHover, $scope.classHoverParent)).toEqual([true, true, true, false, false, true]);
    });
  });

  describe('`rating-states`', function() {
    beforeEach(inject(function() {
      $scope.states = [
        {stateActive: 'sign', stateHover: 'circle'},
        {stateActive: 'heart', stateHover: 'ban'},
        {stateActive: 'heart', stateHover: 'fly'},
        {stateHover: 'float'}
      ];
      element = $compile('<sm-rating ng-model="rate" rating-states="states"></sm-rating>')($scope);
      $scope.$digest();
    }));

    it('should define number of icon elements', function () {
      expect(getStars().length).toBe(4);
      expect(element.attr('aria-valuemax')).toBe('4');
    });

    it('handles each icon', function() {
      let stars = getStars();

      for (let i = 0; i < stars.length; i++) {
        let star = stars.eq(i);
        let state = $scope.states[i];
        let isOn = i < $scope.rate;
        let isHover = i < 2;
        if (isHover) {
          star.trigger('mouseover');
        }

        expect(star.hasClass(state.stateActive)).toBe(isOn);
        expect(star.hasClass(state.stateHover)).toBe(isHover);
      }
    });
  });

  describe('setting ratingConfig', function() {
    let originalConfig = {};
    beforeEach(inject(function(ratingConfig) {
      $scope.rate = 5;
      angular.extend(originalConfig, ratingConfig);
      ratingConfig.max = 10;
      ratingConfig.stateActive = 'on';
      ratingConfig.stateHover = 'float';
      ratingConfig.stateHoverParent = 'float-parent';
      ratingConfig.type = 'heart';
      ratingConfig.size = 'massive';
      element = $compile('<sm-rating ng-model="rate"></sm-rating>')($scope);
      $scope.$digest();
      getStar(7).trigger('mouseover');
    }));
    afterEach(inject(function(ratingConfig) {
      // return it to the original state
      angular.extend(ratingConfig, originalConfig);
    }));

    it('should change number of icon elements', function () {
      expect(getStars().length).toBe(10);
    });

    it('should change icon states', function() {
      expect(getStateActive('on')).toEqual([true, true, true, true, true, false, false, false, false, false]);

      expect(getStateHover('float', 'float-parent')).toEqual([true, true, true, true, true, true, true, false, false, false, true]);
    });

    it('should update rating type', function() {
      expect(element.hasClass('heart')).toBe(true);
    });

    it('should update rating size', function() {
      expect(element.hasClass('massive')).toBe(true);
    });

  });

  it('shows star icon when attribute type is invalid', function() {
    element = $compile('<sm-rating ng-model="rate"></sm-rating>')($scope);
    $scope.$digest();

    expect(element.hasClass('star')).toBe(true);
  });

  it('shows icon type when attribute type is specified', function() {
    element = $compile('<sm-rating ng-model="rate" type="potato"></sm-rating>')($scope);
    $scope.$digest();

    expect(element.hasClass('potato')).toBe(true);
  });

  it('change size when attribute size is set', function() {
    element = $compile('<sm-rating ng-model="rate" size="massive"></sm-rating>')($scope);
    $scope.$digest();

    expect(element.hasClass('massive')).toBe(true);
  });

  it('should change size when attribute size is specified', function() {
    element = $compile('<sm-rating ng-model="rate" size="huge"></sm-rating>')($scope);
    $scope.$digest();

    expect(element.hasClass('huge')).toBe(true);
  });

});
