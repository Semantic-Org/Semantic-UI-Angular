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

  /*
   * TODO(mxth): do not rely on ngRepeat
   * TODO(mxth): do not rely on ngClass
   */
  var template =
    '<div ng-mouseleave="ctrl.reset()" ng-keydown="ctrl.onKeydown($event)" tabindex="0" role="slider"' +
      'aria-valuemin="0" aria-valuemax="{{ctrl.range.length}}" aria-valuenow="{{ctrl.value}}"' +
      'class="ui rating" ng-class="ctrl.hoverValue > -1 && (ctrl.stateHoverParent || \'selected\')">' +
      '<i ng-repeat="r in ctrl.range track by $index" ng-mouseenter="ctrl.enter($index + 1)" ng-click="ctrl.rate($index + 1)"' +
        'class="icon" ng-class="[' +
          '($index < ctrl.value && (r.stateActive || \'active\')) || \'\',' +
          '($index < ctrl.hoverValue && (r.stateHover || \'selected\')) || \'\']">' +
      '</i>' +
    '</div>';

  function smRating() {
    return {
      restrict:'EA',
      replace: true,
      require: ['smRating', 'ngModel'],
      scope: {
        readonly: '=?',
        onHover: '&',
        onLeave: '&'
      },
      controller: smRatingController,
      controllerAs: 'ctrl',
      bindToController: true,
      template: template,
      link: function(scope, element, attrs, ctrls) {
        var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];
        ratingCtrl.init(ngModelCtrl, element);
      }
    };
  }

  smRatingController.$inject = ['$scope', '$attrs', 'ratingConfig'];

  function smRatingController($scope, $attrs, ratingConfig) {
    this.ngModelCtrl  = { $setViewValue: angular.noop };
    this.$scope = $scope;
    this.$attrs = $attrs;
    this.ratingConfig = ratingConfig;
  }

  smRatingController.prototype.init = function(ngModelCtrl_, element) {
    var _this = this;

    element.addClass(angular.isDefined(this.$attrs.type) ? this.$attrs.type : this.ratingConfig.type);
    element.addClass(angular.isDefined(this.$attrs.size) ? this.$attrs.size : this.ratingConfig.size);

    this.ngModelCtrl = ngModelCtrl_;
    this.ngModelCtrl.$render = function() {
      _this.value = _this.ngModelCtrl.$viewValue;
    };

    this.ngModelCtrl.$formatters.push(function(value) {
      if (angular.isNumber(value) && value << 0 !== value) {
        value = Math.round(value);
      }
      return value;
    });

    this.stateActive = this.evalAttribute('stateActive');
    this.stateHover = this.evalAttribute('stateHover');
    this.stateHoverParent = this.evalAttribute('stateHoverParent');

    this.ratingStates = this.evalAttribute('ratingStates', new Array(this.evalAttribute('max')));
    this.range = this.buildTemplateObjects();
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
    if (!this.readonly) {
      this.hoverValue = value;
    }
    this.onHover({value: value});
  };

  smRatingController.prototype.reset = function() {
    this.hoverValue = -1;
    this.onLeave();
  };

  smRatingController.prototype.onKeydown = function(evt) {
    if (/(37|38|39|40)/.test(evt.which)) {
      evt.preventDefault();
      evt.stopPropagation();
      this.rate(this.value + (evt.which === 38 || evt.which === 39 ? 1 : -1));
    }
  };

  smRatingController.prototype.render = function() {
    this.value = this.ngModelCtrl.$viewValue;
  };

  smRatingController.prototype.evalAttribute = function(name, defaultValue) {
    return angular.isDefined(this.$attrs[name]) ? this.$scope.$parent.$eval(this.$attrs[name]) : this.ratingConfig[name] || defaultValue;
  };

})();
