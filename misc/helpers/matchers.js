beforeEach(function() {
'use strict';

  jasmine.addMatchers({

    toHaveClass: function() {
      return {
        compare: function(actual, expected) {
          var result = {};

          result.pass = actual.hasClass(expected);

          if (result.pass) {
            result.message = "Expected '" + angular.mock.dump(actual) + "' to have class '" + expected + "'.";
          } else {
            result.message = "Expected element to have class '" + expected + "' but got '" + angular.mock.dump(actual) + "'.";
          }
          return result;
        }
      }
    }

  });
});
