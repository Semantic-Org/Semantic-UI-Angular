(function() {
  'use strict';

  angular
    .module('semantic.ui.elements.dropdown', [])
    .directive('smDropdown', smDropdown)
    .directive('smDropdownItem', smDropdownItem)
    .directive('smDropdownSearch', smDropdownSearch);

  var keys = {
    enter      : 13,
    space      : 32,
    escape     : 27,
    leftArrow  : 37,
    upArrow    : 38,
    rightArrow : 39,
    downArrow  : 40
  };

  function smDropdown() {
    return {
      restrict: 'E',
      require: ['smDropdown', '?ngModel'],
      compile: compile,
      controller: DropdownCtrl
    };

    function compile(element, attrs) {
      var
        labelElm = element.find('sm-dropdown-label'),
        menuElm = element.find('sm-dropdown-menu');

      labelElm.addClass('text');

      menuElm.addClass('menu transition');
      menuElm.attr('tabindex', -1);

      element.addClass('ui dropdown');
      if (angular.isDefined(attrs.type)) {
        element.addClass(attrs.type);
      }

      if (isType('selection')) {
        labelElm.addClass('default');
      }

      if (isType('search')) {
        element.append('<input class="search" tabindex="0" sm-dropdown-search>');
      } else {
        element.attr('tabindex', 0);
      }

      return postLink;

      function isType(type) {
        return attrs.type && attrs.type.indexOf(type) > -1;
      }
    }

    function postLink(scope, element, attrs, ctrls) {
      var
        dropdownCtrl = ctrls[0],
        ngModel = ctrls[1];

      dropdownCtrl.init(ngModel);
    }
  }

  DropdownCtrl.$inject = ['$scope', '$element', '$attrs', '$parse', '$timeout', '$document'];

  function DropdownCtrl($scope, $element, $attrs, $parse, $timeout, $document) {
    var self = this,
      mouseClick;

    self.$scope = $scope;
    self.$element = $element;
    self.items = [];

    self.labelElm = $element.find('sm-dropdown-label');

    if ($attrs.isOpen) {
      var getter = $parse($attrs.isOpen);
      self.getIsOpen = function() {
        return getter($scope);
      };
      self.setIsOpen = function(value) {
        getter.assign($scope, value);
      };
    }

    var menuElm = $element.find('sm-dropdown-menu');

    $scope.$watch(function() {
      return self.getIsOpen();
    }, function(isOpen) {
      $element[isOpen ? 'addClass' : 'removeClass']('active visible');

      menuElm[isOpen ? 'addClass' : 'removeClass']('visible');
      menuElm[!isOpen ? 'addClass' : 'removeClass']('hidden');

      if (isOpen) {
        var selectedItem = self.getSelectedItem() || self.items[0];

        if (selectedItem) {
          selectedItem.select();
        }

        $timeout(function() {
          $document.on('click', closeDropdown);
        });
      } else {
        $document.off('click', closeDropdown);
      }
    });

    function closeDropdown(event) {
      self.closeDropdown(event);
    }

    $element.on('click', onClick);
    $element.on('focus', onFocus);
    $element.on('blur', onBlur);
    $element.on('keydown', onKeyDown);

    $element.on('mousedown', onMousedown);
    $document.on('click', onDocumentClick);

    $scope.$on('$destroy', function() {
      $document.off('click', onDocumentClick);
    });

    function onClick(event) {
      if (menuElm[0].contains(event.target)) {
        return;
      }
      if (mouseClick) {
        event.preventDefault();
        self.toggle();
      }

      if (self.searchInput) {
        self.searchInput[0].focus();
      }
    }

    function onFocus(event) {
      if (!mouseClick) {
        event.preventDefault();
        self.toggle(true);
      }
    }

    function onBlur(event) {
      if (!mouseClick) {
        event.preventDefault();
        self.toggle(false);
      }
    }

    function onMousedown() {
      mouseClick = true;
    }

    function onDocumentClick() {
      mouseClick = false;
    }

    function onKeyDown(event) {
      if (!self.getIsOpen()) {
        switch (event.keyCode) {
          case keys.space:
          case keys.enter:
          case keys.upArrow:
          case keys.downArrow:
            self.toggle(true);
            break;
        }
      } else {
        switch (event.keyCode) {
          case keys.space:
          case keys.enter:
            var selectedItem = self.getSelectedItem();
            if (selectedItem) {
              selectedItem.$element.triggerHandler('click');
            }
            break;
          case keys.upArrow:
            self.selectPrev();
            break;
          case keys.downArrow:
            self.selectNext();
            break;
          case keys.escape:
            $element.triggerHandler('blur');
            break;
        }
      }
    }
  }

  DropdownCtrl.prototype.init = function(ngModel) {
    var self = this;
    self.ngModel = ngModel;

    if (ngModel) {
      ngModel.$render = function () {
        self.items.forEach(function (item) {
          if (item.active) {
            self.setLabel(item.$element.html());
            self.labelElm.removeClass('default');
          }
        });
      };
    }
  };

  DropdownCtrl.prototype.getIsOpen = function() {
    return this.isOpen;
  };

  DropdownCtrl.prototype.setIsOpen = function(value) {
    this.isOpen = value;
  };

  DropdownCtrl.prototype.toggle = function(open) {
    this.setIsOpen(arguments.length ? !!open : !this.getIsOpen());
    if (!this.$scope.$root.$$phase) {
      this.$scope.$apply();
    }
  };

  DropdownCtrl.prototype.closeDropdown = function(event) {
    if( event && this.autoClose === 'disabled' )  {
      return;
    }
    if( event && this.$element && this.$element[0].contains(event.target) ) {
      return;
    }
    this.toggle(false);
  };

  DropdownCtrl.prototype.addItem = function(item) {
    this.items.push(item);
  };

  DropdownCtrl.prototype.removeItem = function(item) {
    var index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  };

  DropdownCtrl.prototype.select = function(selectedItem) {
    if (!selectedItem) {
      return;
    }
    this.items.forEach(function(item) {
      var isSelected = item === selectedItem;
      item.setSelected(isSelected);
      if (isSelected) {
        item.$element[0].scrollIntoView();
      }
    });
  };

  DropdownCtrl.prototype.selectNext = function() {
    var
      selectedItem = this.getSelectedItem(),
      nextIndex = this.items.indexOf(selectedItem) + 1,
      nextItem = this.items[nextIndex];

    while (nextItem && nextItem.filtered) {
      nextItem = this.items[++nextIndex];
    }

    if (nextItem) {
      this.select(nextItem);
    }
  };

  DropdownCtrl.prototype.selectPrev = function() {
    var
      selectedItem = this.getSelectedItem(),
      prevIndex = this.items.indexOf(selectedItem) - 1,
      prevItem = this.items[prevIndex];

    while (prevItem && prevItem.filtered) {
      prevItem = this.items[--prevIndex];
    }

    if (prevItem) {
      this.select(prevItem);
    }
  };

  DropdownCtrl.prototype.activate = function(activeItem) {
    if (activeItem.filtered) {
      return;
    }

    this.items.forEach(function(item) {
      item.setActive(item === activeItem);
    });

    if (this.ngModel) {
      this.ngModel.$setViewValue(activeItem.value);
      this.ngModel.$render();
    }

    if (this.searchInput) {
      this.searchInput.val('');
      this.searchInput.triggerHandler({ type: 'input' });
    }
  };

  DropdownCtrl.prototype.setLabel = function(html) {
    this.labelElm.html(html);
  };

  DropdownCtrl.prototype.getSelectedItem = function() {
    return this.items.filter(function(item) {
      return item.selected;
    })[0];
  };

  function smDropdownItem() {
    return {
      require: ['^smDropdown', 'smDropdownItem'],
      controller: DropdownItemCtrl,
      link: link
    };

    function link(scope, element, attrs, ctrls) {
      var dropdownCtrl = ctrls[0];
      var dropdownItemCtrl = ctrls[1];

      dropdownItemCtrl.init(dropdownCtrl);

      element.addClass('item');

      if (angular.isDefined(attrs.ngValue)) {
        scope.$watch(attrs.ngValue, setOptionValue);
      } else if (angular.isDefined(attrs.value)) {
        setOptionValue(attrs.value);
      } else {
        setOptionValue(element.text());
      }

      element.on('click', onClick);

      function setOptionValue(value) {
        dropdownItemCtrl.value = value;
      }

      function onClick(event) {
        event.preventDefault();
        scope.$apply(function() {
          dropdownCtrl.activate(dropdownItemCtrl);
          dropdownCtrl.select(dropdownItemCtrl);
          dropdownCtrl.toggle(false);
        });
      }
    }
  }


  DropdownItemCtrl.$inject = ['$scope', '$element'];

  function DropdownItemCtrl($scope, $element) {
    this.$scope = $scope;
    this.$element = $element;
    this.selected = false;
    this.active = false;
    this.filtered = false;
  }

  DropdownItemCtrl.prototype.init = function(dropdownCtrl) {
    var self = this;
    this.dropdownCtrl = dropdownCtrl;

    dropdownCtrl.addItem(self);

    self.$scope.$on('$destroy', function() {
      dropdownCtrl.removeItem(self);
    });
  };

  DropdownItemCtrl.prototype.select = function() {
    this.dropdownCtrl.select(this);
  };

  DropdownItemCtrl.prototype.activate = function() {
    this.dropdownCtrl.activate(this);
  };

  DropdownItemCtrl.prototype.setClass = function(className, value) {
    this.$element[value ? 'addClass' : 'removeClass'](className);
  };

  DropdownItemCtrl.prototype.setSelected = function(isSelected) {
    this.setClass('selected', isSelected);
    this.selected = isSelected;
  };

  DropdownItemCtrl.prototype.setActive = function(isActive) {
    this.active = isActive;
    this.setClass('active', isActive);
  };

  DropdownItemCtrl.prototype.setFiltered = function(isFiltered) {
    this.filtered = isFiltered;
    this.setClass('filtered', isFiltered);
  };

  function smDropdownSearch() {
    return {
      restrict: 'A',
      require: '^smDropdown',
      link: link
    };

    function link(scope, element, attrs, dropdownCtrl) {
      dropdownCtrl.searchInput = element;

      element.on('input', function() {
        var
          query = element.val().toLowerCase(),
          firstItem = null;
        dropdownCtrl.labelElm[!!query ? 'addClass' : 'removeClass']('filtered');

        dropdownCtrl.items.forEach(function(item) {
          var isFiltered = (item.$element.text().toLowerCase().indexOf(query) === -1);
          if (!isFiltered) {
            firstItem = firstItem || item;
          }
          item.setFiltered(isFiltered);
        });

        dropdownCtrl.select(firstItem);

        if (query) {
          dropdownCtrl.toggle(true);
        }
      });

      element.on('focus', function() {
        dropdownCtrl.$element.triggerHandler('focus');
      });
      element.on('blur', function() {
        dropdownCtrl.$element.triggerHandler('blur');
      });
    }
  }

})();
