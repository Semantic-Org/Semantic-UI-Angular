(function() {
  'use strict';

  angular
    .module('semantic.ui.elements.rating', [])
    .constant('ratingConfig', {
      max: 5,
      stateActive: null,
      stateHover: null,
      stateHoverParent: null,
      type: 'star',
      size: ''
    })
    .directive('smRating', smRating);

  smRating.$inject = ['ratingConfig'];

  function smRating(ratingConfig) {
    return {
      restrict:'EA',
      require: ['smRating', 'ngModel'],
      controller: smRatingController,
      compile: compile
    };

    function compile(element, attrs) {
      element.addClass('ui rating');
      element.attr('tabindex', 0);
      element.attr('role', 'slider');
      element.attr('aria-valuemin', 0);

      element.addClass(angular.isDefined(attrs.type) ? attrs.type : ratingConfig.type);
      element.addClass(angular.isDefined(attrs.size) ? attrs.size : ratingConfig.size);

      return postLink;
    }

    function postLink(scope, element, attr, ctrls) {
      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];
      ratingCtrl.init(ngModelCtrl);
    }
  }

  smRatingController.$inject = ['$scope', '$element', '$attrs', 'ratingConfig', '$parse'];

  function smRatingController($scope, $element, $attrs, ratingConfig, $parse) {
    var self = this;

    self.$scope = $scope;
    self.$element = $element;
    self.$attrs = $attrs;
    self.ratingConfig = ratingConfig;

    self.ngModelCtrl  = { $setViewValue: angular.noop };

    if (angular.isDefined($attrs.readonly)) {
      $scope.$watch($parse($attrs.readonly), function(readonly) {
        self.readonly = readonly;
      });
    }

    self.onHover = function(value) {
      if (angular.isDefined($attrs.onHover)) {
        $scope.$eval($attrs.onHover, { value: value });
      }
    };

    self.onLeave = function() {
      if (angular.isDefined($attrs.onLeave)) {
        $scope.$eval($attrs.onLeave);
      }
    };

    self.stateActive = self.evalAttribute('stateActive', 'active');
    self.stateHover = self.evalAttribute('stateHover', 'selected');
    self.stateHoverParent = self.evalAttribute('stateHoverParent', 'selected');

    self.ratingStates = self.evalAttribute('ratingStates', new Array(self.evalAttribute('max')));
    self.range = self.buildTemplateObjects();

    self.range.forEach(function(icon, index) {
      var iconElm = angular.element('<i class="icon"></i>');
      iconElm.on('mouseenter', function() {
        $scope.$apply(function() {
          self.enter(index + 1);
        });
      });
      iconElm.on('click', function() {
        $scope.$apply(function() {
          self.rate(index + 1);
        });
      });
      icon.element = iconElm;

      $element.append(iconElm);
    });

    $element.attr('aria-valuemax', self.range.length);

    $element.on('mouseleave', onMouseLeave);
    $element.on('keydown', onKeydown);

    function onMouseLeave() {
      $scope.$apply(function() {
        self.hoverValue = -1;
        self.onLeave();
        $element.removeClass(self.stateHoverParent);
        self.updateStateHover();
      });
    }

    function onKeydown(evt) {
      if (/(37|38|39|40)/.test(evt.which)) {
        evt.preventDefault();
        evt.stopPropagation();
        $scope.$apply(function() {
          self.rate(self.value + (evt.which === 38 || evt.which === 39 ? 1 : -1));
        });
      }
    }
  }

  smRatingController.prototype.init = function(ngModelCtrl_) {
    var self = this;

    self.ngModelCtrl = ngModelCtrl_;
    self.ngModelCtrl.$render = function() {
      self.value = self.ngModelCtrl.$viewValue;

      self.$element.attr('aria-valuenow', self.value);

      self.range.forEach(function(icon, index) {
        icon.element[index < self.value ? 'addClass' : 'removeClass'](icon.stateActive);
      });
    };

    self.ngModelCtrl.$formatters.push(function(value) {
      if (angular.isNumber(value) && value << 0 !== value) {
        value = Math.round(value);
      }
      return value;
    });
  };

  smRatingController.prototype.buildTemplateObjects = function() {
    var states = this.ratingStates;
    for (var i = 0, n = states.length; i < n; i++) {
      states[i] = angular.extend({ index: i }, { stateActive: this.stateActive, stateHover: this.stateHover }, states[i]);
    }
    return states;
  };

  smRatingController.prototype.rate = function(value) {
    if (!this.readonly && value >= 0 && value <= this.range.length ) {
      this.ngModelCtrl.$setViewValue(value);
      this.ngModelCtrl.$render();
    }
  };

  smRatingController.prototype.enter = function(value) {
    var self = this;
    if (!self.readonly) {
      self.hoverValue = value;
      self.$element.addClass(self.stateHoverParent);
      self.updateStateHover();
    }
    self.onHover(value);
  };

  smRatingController.prototype.updateStateHover = function() {
    var self = this;
    self.range.forEach(function(icon, index) {
      icon.element[index < self.hoverValue ? 'addClass' : 'removeClass'](icon.stateHover);
    });
  };

  smRatingController.prototype.evalAttribute = function(name, defaultValue) {
    return angular.isDefined(this.$attrs[name]) ? this.$scope.$eval(this.$attrs[name]) : this.ratingConfig[name] || defaultValue;
  };

})();
