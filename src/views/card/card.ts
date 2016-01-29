///<reference path="../../../typings/angularjs/angular.d.ts"/>
///<reference path="../../../typings/angularjs/angular-animate.d.ts"/>

import { isContainerDefined, wrapWithContainer } from './../../core/dom';
import { ComponentDirective } from './../../core/directives';

'use strict';

/**
 * sm-card directive
 */

class SmCardDirective extends ComponentDirective {
  static instance(): ng.IDirective {
    return new SmCardDirective;
  }

  template = `<div class="ui card"></div>`;
}

/**
 * sm-card-content directive
 */

class SmCardContentDirective extends ComponentDirective {
  static instance(): ng.IDirective {
    return new SmCardContentDirective;
  }

  template = `<div class="content"></div>`;
}

/**
 * sm-card-header directive
 */

class SmCardHeaderDirective extends ComponentDirective {
  static instance(): ng.IDirective {
    return new SmCardHeaderDirective;
  }

  require = '^smCardContent';
  template = `<div class="header"></div>`;
}

/**
 * sm-card-meta directive
 */

class SmCardMetaDirective extends ComponentDirective {
  static instance(): ng.IDirective {
    return new SmCardMetaDirective;
  }

  require = '^smCardContent';
  template = `<div class="meta"></div>`;
}

/**
 * sm-card-description directive
 */

class SmCardDescriptionDirective extends ComponentDirective {
  static instance(): ng.IDirective {
    return new SmCardDescriptionDirective;
  }

  require = '^smCardContent';
  template = `<div class="description"></div>`;
}

/**
 * sm-card-image directive
 */

class SmCardImageDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmCardImageDirective;
  }

  restrict = 'A';
  replace = true;
  scope = {};

  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery
  ) => {

    let node: HTMLElement = element[0];

    if (!isContainerDefined(node, 'image')) {
      wrapWithContainer(node, 'image');
    }
  };
}

/**
 * sm-card-avatar directive
 */

class SmCardAvatarDirective implements ng.IDirective {
  static instance(): ng.IDirective {
    return new SmCardAvatarDirective;
  }

  restrict = 'A';
  replace = true;
  scope = {};

  link = (
    scope: ng.IScope,
    element: ng.IAugmentedJQuery
  ) => {
    element.addClass('ui avatar image');
  };
}

export var smCardModule: ng.IModule = angular
  .module('semantic.ui.views.card', [])
  .directive('smCard', SmCardDirective.instance)
  .directive('smCardContent', SmCardContentDirective.instance)
  .directive('smCardHeader', SmCardHeaderDirective.instance)
  .directive('smCardMeta', SmCardMetaDirective.instance)
  .directive('smCardDescription', SmCardDescriptionDirective.instance)
  .directive('smCardImage', SmCardImageDirective.instance)
  .directive('smCardAvatar', SmCardAvatarDirective.instance);
