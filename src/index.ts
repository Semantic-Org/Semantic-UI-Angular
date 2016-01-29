///<reference path="../typings/angularjs/angular.d.ts"/>

import { smCoreModule } from './core/layout/core.layout.module';

import { smButtonModule } from './elements/button/button';
import { smCardModule } from './views/card/card';

((): void => {
  'use strict';

  angular
    .module('semantic.ui', [
      smCoreModule.name,
      smButtonModule.name,
      smCardModule.name
    ]);

})();
