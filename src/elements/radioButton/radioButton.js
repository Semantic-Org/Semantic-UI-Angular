(function() {
'use strict';

angular
  .module('semantic.ui.elements.radioButton', [])
  .directive('smRadioGroup', smRadioGroup)
  .directive('smRadioButton', smRadioButton);

  smRadioButton.$inject = ['$animate'];

  function smRadioGroup() {
    return {
      restrict: 'E',
      replace: true,
      require: ['smRadioGroup', '?ngModel'],
      transclude: true,
      controller: smRadioGroupController,
      link: function(scope, element, attrs, ctrls) {
        var smRadioGroupCtrl = ctrls[0];
        var ngModelCtrl = ctrls[1];

        if (!ngModelCtrl) { return; }

        smRadioGroupCtrl.setNgModelCtrl(ngModelCtrl);
      },
      template: '<div class="ui buttons" ng-transclude></div>'
    };

    function smRadioGroupController() {
      /*jshint validthis: true */
      this._radioBtnElements = [];
      this._radioBtnFns = [];

      this.setNgModelCtrl = function(ngModelCtrl) {
        this._ngModelCtrl = ngModelCtrl;
        this._ngModelCtrl.$render = angular.bind(this, this.render);
      };

      this.registerBtnElement = function(element) {
        this._radioBtnElements.push(element);
      };

      this.addBtn = function(renderFn) {
        this._radioBtnFns.push(renderFn);
      };

      this.removeBtn = function(renderFn) {
        var btnIndex = this._radioBtnFns.indexOf(renderFn);
        if (btnIndex !== -1) {
          this._radioBtnFns.splice(btnIndex, 1);
        }
      };

      this.render = function() {
        this._radioBtnFns.forEach(function(renderFn) {
          renderFn();
        });
      };

      this.setViewValue = function(value, event) {
        this._ngModelCtrl.$setViewValue(value, event);
        this.render();
      };

      this.getViewValue = function() {
        return this._ngModelCtrl.$viewValue;
      };

    }

  }

  function smRadioButton($animate) {
    return {
      restrict: 'E',
      replace: true,
      require: '^smRadioGroup',
      transclude: true,
      link: function(scope, element, attrs, smRadioGroupCtrl) {
        var isChecked;

        smRadioGroupCtrl.registerBtnElement(element);
        smRadioGroupCtrl.addBtn(render);
        attrs.$observe('value', render);

        element
          .on('click', eventListener)
          .on('$destroy', function() {
            smRadioGroupCtrl.removeBtn(render);
          });

        function eventListener(event) {
          if (element[0].hasAttribute('disabled') || attrs.value === void 0) { return; }

          scope.$apply(function() {
            smRadioGroupCtrl.setViewValue(attrs.value, event && event.type);
          });
        }

        function render() {
          var checked = (scope.$eval(attrs.value) === smRadioGroupCtrl.getViewValue());

          if(isChecked === checked) { return; }

          isChecked = checked;

          if(checked) {
            $animate.addClass(element, 'active');
          } else {
            $animate.removeClass(element, 'active');
          }
        }
      },
      template:'<div class="ui button" ng-transclude></div>'
    };
  }

})();