///<reference path="../../../typings/angularjs/angular.d.ts"/>

'use strict';

const ratingConfig = {
  max: 5,
  size: '',
  stateActive: 'active',
  stateHover: 'selected',
  stateHoverParent: 'selected',
  type: 'star'
};

class SmRatingController {
  static $inject = ['$scope', '$element', '$attrs'];

  hoverValue: number;
  readonly: boolean;

  stateHoverParent: string;

  ratingStates: RatingState[];
  icons: Icon[];

  ngModel: ng.INgModelController;

  constructor(public $scope: ng.IScope, public $element: ng.IAugmentedJQuery, public $attrs) {
    const
      ratingStates: RatingState[] = this.evalAttribute('ratingStates') || Array.apply(null, Array(this.evalAttribute('max'))),
      stateActive = this.evalAttribute('stateActive'),
      stateHover = this.evalAttribute('stateHover'),
      stateHoverParent = this.evalAttribute('stateHoverParent');

    if (angular.isDefined($attrs.readonly)) {
      $scope.$watch($attrs.readonly, (readonly: boolean) => {
        this.readonly = readonly;
      });
    }

    this.icons = ratingStates.map((state, index): Icon => {
      const
        iconElm = angular.element('<i class="icon"></i>'),
        value = index + 1;

      iconElm.on('mouseenter', () => {
        $scope.$apply(() => {
          if (!this.readonly) {
            this.hoverValue = value;
            this.$element.addClass(stateHoverParent);
            this.updateStateHover();
          }
          if (angular.isDefined(this.$attrs.onHover)) {
            this.$scope.$eval(this.$attrs.onHover, { value: value });
          }
        });
      });

      iconElm.on('click', () => {
        this.rate(value);
      });

      return angular.extend(<Icon>{
        element: iconElm,
        index: index,
        stateActive: stateActive,
        stateHover: stateHover
      }, state);
    });

    this.icons.forEach(icon => {
      $element.append(icon.element);
    });

    $element
      .addClass('ui rating')
      .addClass($attrs.type || ratingConfig.type)
      .addClass($attrs.size || ratingConfig.size)
      .attr({
        'aria-valuemax': this.icons.length,
        'aria-valuemin': 0,
        role: 'slider',
        tabindex: 0
      })
      .on('mouseleave', () => {
        this.hoverValue = -1;
        if (angular.isDefined($attrs.onLeave)) {
          $scope.$evalAsync($attrs.onLeave);
        }
        $element.removeClass(stateHoverParent);
        this.updateStateHover();
      })
      .on('keydown', (evt: any) => {
        if (/(37|38|39|40)/.test(evt.which)) {
          evt.preventDefault();
          evt.stopPropagation();
          this.rate(this.ngModel.$viewValue + (evt.which === 38 || evt.which === 39 ? 1 : -1));
        }
      });
  }

  rate(value: number) {
    if (!this.readonly && value >= 0 && value <= this.icons.length) {
      this.ngModel.$setViewValue(value);
      this.ngModel.$render();
    }
  }

  init(ngModel: ng.INgModelController) {
    this.ngModel = ngModel;

    ngModel.$render = () => {
      const value = ngModel.$viewValue;
      this.$element.attr('aria-valuenow', value);

      this.icons.forEach((icon: Icon, index) => {
        icon.element[index < value ? 'addClass' : 'removeClass'](icon.stateActive);
      });
    };

    ngModel.$formatters.push((value) => {
      if (angular.isNumber(value) && value % 1 !== 0) {
        value = Math.round(value);
      }
      return value;
    });
  }

  updateStateHover() {
    this.icons.forEach((icon: Icon, index) => {
      icon.element[index < this.hoverValue ? 'addClass' : 'removeClass'](icon.stateHover);
    });
  }

  evalAttribute(attr: string) {
    return angular.isDefined(this.$attrs[attr]) ?
      this.$scope.$eval(this.$attrs[attr]) :
      ratingConfig[attr];
  }
}

class SmRatingDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmRatingDirective;
  }

  restrict = 'E';
  require = ['smRating', 'ngModel'];
  controller = SmRatingController;
  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery,
    attrs,
    ctrls: [SmRatingController, ng.INgModelController]
  ) => {
    const [smRating, ngModel] = ctrls;
    smRating.init(ngModel);
  };
}

interface Icon extends RatingState {
  index: number;
  element: ng.IAugmentedJQuery;
}

interface RatingState {
  stateActive: string;
  stateHover: string;
}

export const smRatingModule = angular
  .module('semantic.ui.modules.rating', [])
  .directive('smRating', SmRatingDirective.instance)
  .constant('ratingConfig', ratingConfig);
