///<reference path="../typings/angularjs/angular.d.ts"/>


import { smAccordionModule } from './modules/accordion/accordion.module';
import { smButtonModule } from './elements/button/button';
import { smRatingModule } from './modules/rating/rating';
import { smDividerModule } from './elements/divider/divider';

((): void => {
  'use strict';

  angular
    .module('semantic.ui', [
      smButtonModule.name,
      smRatingModule.name,
      smDividerModule.name,

      smAccordionModule.name
    ]);

})();
