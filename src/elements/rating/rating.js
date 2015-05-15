(function() {
  'use strict';

  angular
    .module('semantic.ui.elements.rating', [])
    .constant('ratingConfig', {
      max: 5,
      stateActive: null,
      stateHover: null,
      stateHoverParent: null
    })
    .directive('smRating', smRating);

  var template =
    '<div ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider"' +
      'aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}"' +
      'class="ui rating" ng-class="hoverValue > -1 && (stateHoverParent || \'selected\')">' +
      '<i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)"' +
        'class="icon" ng-class="[' +
          '($index < value && (r.stateActive || \'active\')) || \'\',' +
          '($index < hoverValue && (r.stateHover || \'selected\')) || \'\']">' +
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
      template: template,
      link: function(scope, element, attrs, ctrls) {
        var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];
        ratingCtrl.init(ngModelCtrl);

        element.addClass(/(star|heart)/.test(attrs.type) ? attrs.type : 'star');
        element.addClass(/(mini|tiny|small|large|huge|massive)/.test(attrs.size) ? attrs.size : '');
      }
    };
  }

  smRatingController.$inject = ['$scope', '$attrs', 'ratingConfig'];

  function smRatingController($scope, $attrs, ratingConfig) {
    var ngModelCtrl  = { $setViewValue: angular.noop };

    this.init = function(ngModelCtrl_) {
      ngModelCtrl = ngModelCtrl_;
      ngModelCtrl.$render = this.render;

      ngModelCtrl.$formatters.push(function(value) {
        if (angular.isNumber(value) && value << 0 !== value) {
          value = Math.round(value);
        }
        return value;
      });

      this.stateActive = angular.isDefined($attrs.stateActive) ? $scope.$parent.$eval($attrs.stateActive) : ratingConfig.stateActive;
      this.stateHover = angular.isDefined($attrs.stateHover) ? $scope.$parent.$eval($attrs.stateHover) : ratingConfig.stateHover;

      $scope.stateHoverParent = angular.isDefined($attrs.stateHoverParent) ? $scope.$parent.$eval($attrs.stateHoverParent) : ratingConfig.stateHoverParent;

      var ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) :
                          new Array( angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max );
      $scope.range = this.buildTemplateObjects(ratingStates);
    };

    this.buildTemplateObjects = function(states) {
      for (var i = 0, n = states.length; i < n; i++) {
        states[i] = angular.extend({ index: i }, { stateActive: this.stateActive, stateHover: this.stateHover }, states[i]);
      }
      return states;
    };

    $scope.rate = function(value) {
      if (!$scope.readonly && value >= 0 && value <= $scope.range.length ) {
        ngModelCtrl.$setViewValue(value);
        ngModelCtrl.$render();
      }
    };

    $scope.enter = function(value) {
      if (!$scope.readonly) {
        $scope.hoverValue = value;
      }
      $scope.onHover({value: value});
    };

    $scope.reset = function() {
      $scope.hoverValue = -1;
      $scope.onLeave();
    };

    $scope.onKeydown = function(evt) {
      if (/(37|38|39|40)/.test(evt.which)) {
        evt.preventDefault();
        evt.stopPropagation();
        $scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1));
      }
    };

    this.render = function() {
      $scope.value = ngModelCtrl.$viewValue;
    };
  }
})();
