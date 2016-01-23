///<reference path="../typings/angularjs/angular.d.ts"/>

import { smButtonModule } from './elements/button/button';

((): void => {
  'use strict';

  angular
    .module('semantic.ui', [
      smButtonModule.name
    ]);

})();
