///<reference path="../typings/angularjs/angular.d.ts"/>

import { smButtonModule } from './elements/button/button';
import { smRatingModule } from './modules/rating/rating';
import { smCheckboxModule } from './modules/checkbox/checkbox';

((): void => {
  'use strict';

  angular
    .module('semantic.ui', [
      smButtonModule.name,
      smRatingModule.name,
      smCheckboxModule.name
    ]);

})();
