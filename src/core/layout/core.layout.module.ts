import { SmAlignRightDirective } from './align-right/align-right';

'use strict';

export var smCoreModule: ng.IModule = angular
  .module('semantic.ui.core.layout', [])
  .directive('smAlignRight', SmAlignRightDirective.instance);
