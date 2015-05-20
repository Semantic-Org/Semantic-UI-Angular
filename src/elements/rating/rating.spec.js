describe('Semantic-UI: Elements - smRating', function() {
  'use strict';

  var $rootScope, $compile, element;

  beforeEach(module('semantic.ui.elements.rating'));

  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_.$new();
    $compile = _$compile_;
    $rootScope.rate = 3;
    element = $compile('<sm-rating ng-model="rate"></sm-rating>')($rootScope);
    $rootScope.$digest();
  }));

  function getStars() {
    return element.find('i');
  }

  function getStar(number) {
    return getStars().eq( number - 1 );
  }

  function getState(className, classDefault) {
    var stars = getStars();
    var state = [];
    for (var i = 0, n = stars.length; i < n; i++) {
      state.push(stars.eq(i).hasClass(className || classDefault));
    }
    return state;
  }

  function getStateActive(classActive) {
    return getState(classActive, 'active');
  }

  function getStateHover(classHover, classHoverParent) {
    var classDefault = 'selected';
    return getState(classHover, classDefault).concat([element.hasClass(classHoverParent || classDefault)]);
  }

  function triggerKeyDown(keyCode) {
    var e = $.Event('keydown');
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
    $rootScope.$digest();
    expect(getStateActive()).toEqual([true, true, false, false, false]);
    expect($rootScope.rate).toBe(2);
    expect(element.attr('aria-valuenow')).toBe('2');

    getStar(5).click();
    $rootScope.$digest();
    expect(getStateActive()).toEqual([true, true, true, true, true]);
    expect($rootScope.rate).toBe(5);
    expect(element.attr('aria-valuenow')).toBe('5');
  });

  it('handles correctly the hover event', function() {
    getStar(2).trigger('mouseover');
    $rootScope.$digest();
    expect(getStateHover()).toEqual([true, true, false, false, false, true]);
    expect($rootScope.rate).toBe(3);

    getStar(5).trigger('mouseover');
    $rootScope.$digest();
    expect(getStateHover()).toEqual([true, true, true, true, true, true]);
    expect($rootScope.rate).toBe(3);

    element.trigger('mouseout');
    expect(getStateHover()).toEqual([false, false, false, false, false, false]);
    expect($rootScope.rate).toBe(3);
  });

  it('rounds off the number of stars shown with decimal values', function() {
    $rootScope.rate = 2.1;
    $rootScope.$digest();

    expect(getStateActive()).toEqual([true, true, false, false, false]);
    expect(element.attr('aria-valuenow')).toBe('2');

    $rootScope.rate = 2.5;
    $rootScope.$digest();

    expect(getStateActive()).toEqual([true, true, true, false, false]);
    expect(element.attr('aria-valuenow')).toBe('3');
  });

  it('changes the number of selected icons when value changes', function() {
    $rootScope.rate = 2;
    $rootScope.$digest();

    expect(getStateActive()).toEqual([true, true, false, false, false]);
    expect(element.attr('aria-valuenow')).toBe('2');
  });

  it('shows different number of icons when `max` attribute is set', function() {
    element = $compile('<sm-rating ng-model="rate" max="7"></sm-rating>')($rootScope);
    $rootScope.$digest();

    expect(getStars().length).toBe(7);
    expect(element.attr('aria-valuemax')).toBe('7');
  });

  it('shows different number of icons when `max` attribute is from scope variable', function() {
    $rootScope.max = 15;
    element = $compile('<sm-rating ng-model="rate" max="max"></sm-rating>')($rootScope);
    $rootScope.$digest();
    expect(getStars().length).toBe(15);
    expect(element.attr('aria-valuemax')).toBe('15');
  });

  it('handles readonly attribute', function() {
    $rootScope.isReadonly = true;
    element = $compile('<sm-rating ng-model="rate" readonly="isReadonly"></sm-rating>')($rootScope);
    $rootScope.$digest();

    expect(getStateActive()).toEqual([true, true, true, false, false]);

    var star5 = getStar(5);
    star5.trigger('mouseover');
    $rootScope.$digest();
    expect(getStateActive()).toEqual([true, true, true, false, false]);
    expect(getStateHover()).toEqual([false, false, false, false, false, false]);

    $rootScope.isReadonly = false;
    $rootScope.$digest();

    star5.trigger('mouseover');
    $rootScope.$digest();
    expect(getStateHover()).toEqual([true, true, true, true, true, true]);
  });

  it('should fire onHover', function() {
    $rootScope.hoveringOver = jasmine.createSpy('hoveringOver');
    element = $compile('<sm-rating ng-model="rate" on-hover="hoveringOver(value)"></sm-rating>')($rootScope);
    $rootScope.$digest();

    getStar(3).trigger('mouseover');
    $rootScope.$digest();
    expect($rootScope.hoveringOver).toHaveBeenCalledWith(3);
  });

  it('should fire onLeave', function() {
    $rootScope.leaving = jasmine.createSpy('leaving');
    element = $compile('<sm-rating ng-model="rate" on-leave="leaving()"></sm-rating>')($rootScope);
    $rootScope.$digest();

    element.trigger('mouseleave');
    $rootScope.$digest();
    expect($rootScope.leaving).toHaveBeenCalled();
  });

  describe('keyboard navigation', function() {
    it('supports arrow keys', function() {
      triggerKeyDown(38);
      expect($rootScope.rate).toBe(4);

      triggerKeyDown(37);
      expect($rootScope.rate).toBe(3);
      triggerKeyDown(40);
      expect($rootScope.rate).toBe(2);

      triggerKeyDown(39);
      expect($rootScope.rate).toBe(3);
    });

    it('supports only arrow keys', function() {
      $rootScope.rate = undefined;
      $rootScope.$digest();

      triggerKeyDown(36);
      expect($rootScope.rate).toBe(undefined);

      triggerKeyDown(41);
      expect($rootScope.rate).toBe(undefined);
    });

    it('can get zero value but not negative', function() {
      $rootScope.rate = 1;
      $rootScope.$digest();

      triggerKeyDown(37);
      expect($rootScope.rate).toBe(0);

      triggerKeyDown(37);
      expect($rootScope.rate).toBe(0);
    });

    it('cannot get value above max', function() {
      $rootScope.rate = 4;
      $rootScope.$digest();

      triggerKeyDown(38);
      expect($rootScope.rate).toBe(5);

      triggerKeyDown(38);
      expect($rootScope.rate).toBe(5);
    });
  });

  describe('custom states', function() {
    beforeEach(inject(function() {
      $rootScope.classActive = 'foo-active';
      $rootScope.classHover = 'foo-hover';
      $rootScope.classHoverParent = 'foo-hover-parent';
      element = $compile('<sm-rating ng-model="rate" state-active="classActive" state-hover="classHover" state-hover-parent="classHoverParent"></sm-rating>')($rootScope);
      $rootScope.$digest();
    }));

    it('changes the default icons', function() {
      expect(getStateActive($rootScope.classActive)).toEqual([true, true, true, false, false]);
      getStar(3).trigger('mouseover');
      expect(getStateHover($rootScope.classHover, $rootScope.classHoverParent)).toEqual([true, true, true, false, false, true]);
    });
  });

  describe('`rating-states`', function() {
    beforeEach(inject(function() {
      $rootScope.states = [
        {stateActive: 'sign', stateHover: 'circle'},
        {stateActive: 'heart', stateHover: 'ban'},
        {stateActive: 'heart', stateHover: 'fly'},
        {stateHover: 'float'}
      ];
      element = $compile('<sm-rating ng-model="rate" rating-states="states"></sm-rating>')($rootScope);
      $rootScope.$digest();
    }));

    it('should define number of icon elements', function () {
      expect(getStars().length).toBe(4);
      expect(element.attr('aria-valuemax')).toBe('4');
    });

    it('handles each icon', function() {
      var stars = getStars();
      getStars(3).trigger('mouseover');

      for (var i = 0; i < stars.length; i++) {
        var star = stars.eq(i);
        var state = $rootScope.states[i];
        var isOn = i < $rootScope.rate;
        var isHover = i <= 3;

        expect(star.hasClass(state.stateActive)).toBe(isOn);
        expect(star.hasClass(state.stateHover)).toBe(isHover);
      }
    });
  });

  describe('setting ratingConfig', function() {
    var originalConfig = {};
    beforeEach(inject(function(ratingConfig) {
      $rootScope.rate = 5;
      angular.extend(originalConfig, ratingConfig);
      ratingConfig.max = 10;
      ratingConfig.stateActive = 'on';
      ratingConfig.stateHover = 'float';
      ratingConfig.stateHoverParent = 'float-parent';
      ratingConfig.type = 'heart';
      ratingConfig.size = 'massive';
      element = $compile('<sm-rating ng-model="rate"></sm-rating>')($rootScope);
      $rootScope.$digest();
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
    element = $compile('<sm-rating ng-model="rate"></sm-rating>')($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('star')).toBe(true);
  });

  it('shows icon type when attribute type is specified', function() {
    element = $compile('<sm-rating ng-model="rate" type="potato"></sm-rating>')($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('potato')).toBe(true);
  });

  it('change size when attribute size is set', function() {
    element = $compile('<sm-rating ng-model="rate" size="massive"></sm-rating>')($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('massive')).toBe(true);
  });

  it('should change size when attribute size is specified', function() {
    element = $compile('<sm-rating ng-model="rate" size="huge"></sm-rating>')($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('huge')).toBe(true);
  });

});
