describe('Semantic-UI: Elements - smRating', function() {
  'use strict';

  var $rootScope, $compile, element;

  var keys = {
    enter      : 13,
    space      : 32,
    escape     : 27,
    leftArrow  : 37,
    upArrow    : 38,
    rightArrow : 39,
    downArrow  : 40
  };

  beforeEach(module('semantic.ui.elements.dropdown'));

  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_.$new();
    $compile = _$compile_;
    element = $compile(
      '<sm-dropdown ng-model="selected" is-open="isOpen">' +
        '<sm-dropdown-label>Shop</sm-dropdown-label>' +
        '<sm-dropdown-menu>' +
          '<sm-dropdown-item>0</sm-dropdown-item>' +
          '<sm-dropdown-item value="one">1</sm-dropdown-item>' +
          '<sm-dropdown-item ng-value="two"><b>2</b></sm-dropdown-item>' +
        '</sm-dropdown-menu>' +
      '</sm-dropdown>'
    )($rootScope);
    $rootScope.isOpen = false;
    $rootScope.two = { value: 2 };
    $rootScope.$digest();
  }));

  function getItems() {
    return element.find('sm-dropdown-item');
  }
  function getItem(order) {
    return getItems().eq(order);
  }

  function getLabel() {
    return element.find('sm-dropdown-label');
  }

  function getMenu() {
    return element.find('sm-dropdown-menu');
  }

  function getSearchInput() {
    return element.find('input');
  }

  function dropdownClick() {
    element.mousedown();
    element.click();
  }

  function triggerKeyDown(keyCode) {
    var e = $.Event('keydown');
    e.keyCode = keyCode;
    element.trigger(e);
  }

  function expectOpen() {
    expect(element.hasClass('active visible')).toBe(true);
    expect(getMenu().hasClass('transition visible')).toBe(true);
    expect($rootScope.isOpen).toBe(true);
  }

  function expectClosed() {
    expect(element.hasClass('active visible')).toBe(false);
    expect(getMenu().hasClass('transition hidden')).toBe(true);
    expect($rootScope.isOpen).toBe(false);
  }

  function getState(className) {
    var items = getItems();
    var state = [];
    for (var i = 0, n = items.length; i < n; i++) {
      state.push(items.eq(i).hasClass(className));
    }
    return state;
  }

  function getStateSelected() {
    return getState('selected');
  }

  function getStateActive() {
    return getState('active');
  }

  function getStateFiltered() {
    return getState('filtered');
  }

  it('simple dropdown', function() {
    expect(element.hasClass('ui dropdown')).toBe(true);
    expect(getItem(1).hasClass('item')).toBe(true);
    expect(getMenu().hasClass('menu')).toBe(true);
  });

  it('open dropdown when model is changed', function() {
    $rootScope.isOpen = true;
    $rootScope.$digest();
    expectOpen();
  });

  it('open dropdown with a click', function() {
    dropdownClick();
    expectOpen();
  });

  it('open dropdown when focused', function() {
    element.triggerHandler('focus');
    expectOpen();
  });

  it('select item', function() {
    dropdownClick();
    getItem(0).click();
    expect($rootScope.selected).toEqual('0');
    expect(getStateActive()).toEqual([true, false, false]);
    expect(getLabel().html()).toEqual(getItem(0).html());
    expectClosed();

    dropdownClick();
    getItem(1).click();
    expect($rootScope.selected).toEqual('one');
    expect(getStateActive()).toEqual([false, true, false]);
    expect(getLabel().html()).toEqual(getItem(1).html());
    expectClosed();

    dropdownClick();
    getItem(2).click();
    expect($rootScope.selected).toBe($rootScope.two);
    expect(getStateActive()).toEqual([false, false, true]);
    expect(getLabel().html()).toEqual(getItem(2).html());
    expectClosed();
  });

  it('select item using keyboard', function() {
    dropdownClick();
    expect(getStateActive()).toEqual([false, false, false]);
    expect(getStateSelected()).toEqual([true, false, false]);

    triggerKeyDown(keys.downArrow);
    expect(getStateSelected()).toEqual([false, true, false]);

    triggerKeyDown(keys.upArrow);
    expect(getStateSelected()).toEqual([true, false, false]);

    triggerKeyDown(keys.enter);
    expect($rootScope.selected).toEqual('0');
    expect(getStateActive()).toEqual([true, false, false]);
    expect(getLabel().html()).toEqual(getItem(0).html());
    expectClosed();
  });

  describe('Search selection dropdown', function() {
    beforeEach(inject(function(_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_.$new();
      $compile = _$compile_;
      element = $compile(
        '<sm-dropdown type="search selection" ng-model="selected">' +
          '<sm-dropdown-label>Shop</sm-dropdown-label>' +
          '<sm-dropdown-menu>' +
            '<sm-dropdown-item>zero</sm-dropdown-item>' +
            '<sm-dropdown-item>one</sm-dropdown-item>' +
            '<sm-dropdown-item>two</sm-dropdown-item>' +
          '</sm-dropdown-menu>' +
        '</sm-dropdown>'
      )($rootScope);
      $rootScope.$digest();
    }));

    it('should have search input', function() {
      expect(getSearchInput().length).toEqual(1);
    });

    it('should filter one', function() {
      getSearchInput().val('on').trigger('input');
      expect(getStateFiltered()).toEqual([true, false, true]);
    });

    it('should not select filtered items', function() {
      getSearchInput().val('on').trigger('input');
      expect(getStateFiltered()).toEqual([true, false, true]);
      expect(getStateSelected()).toEqual([false, true, false]); // select the first result
      triggerKeyDown(keys.downArrow);
      triggerKeyDown(keys.downArrow);
      expect(getStateSelected()).toEqual([false, true, false]);
      triggerKeyDown(keys.upArrow);
      triggerKeyDown(keys.upArrow);
      triggerKeyDown(keys.upArrow);
      triggerKeyDown(keys.upArrow);
      expect(getStateSelected()).toEqual([false, true, false]);
    });
  });

});
