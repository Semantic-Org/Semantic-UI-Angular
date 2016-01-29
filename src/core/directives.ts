///<reference path="../../typings/angularjs/angular.d.ts"/>

/**
 * Template class for wrapper-type directives
 */
export class ComponentDirective implements ng.IDirective {

  restrict = 'E';
  replace = true;
  transclude = true;
  template = ``;
  controller = ComponentDirectiveController;
  controllerAs = '$ctrl';
  bindToController = true;
  scope = {};

  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery,
    attrs,
    ctrl,
    transclude: ng.ITranscludeFunction
  ) => {
    // transclude when we actually want it
    if (transclude) {
      transclude(scope, (nodes) => {
        element.append(nodes);
      });
    }
  };
}

class ComponentDirectiveController { }
