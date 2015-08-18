(function(app)
{

  app.directive('smRatingBind', ['SemanticUI', 
  function SemanticRatingBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smRatingBind', 'rating' );
  }]);

  var BEHAVIORS = {
    smRatingSet:        'set rating',
    smRatingDisable:    'disable',
    smRatingEnable:     'enable',
    smRatingClear:      'clear rating'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'rating', method );
    }]);
  });

  app.directive('smRating', ['SemanticUI',
  function SemanticRating(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Required */
        model: '=',
        total: '=',
        /* Optional */
        type: '@',
        disabled: '=',
        settings: '=',
        onInit: '=',
        /* Events */
        onRate: '='
      },

      template: '<div class="ui rating {{ type }}" data-rating="{{ model }}" data-max-rating="{{ total }}"></div>',

      link: function(scope, element, attributes) 
      {
        element.ready(function() 
        {
          var settings = scope.settings || {};

          SemanticUI.linkSettings( scope, element, attributes, 'rating', true );

          SemanticUI.triggerChange( scope, 'model', element, true );

          if ( attributes.disabled )
          {
            var disabledWatcher = SemanticUI.watcher( scope, 'disabled', 
              function(updated) {
                element.rating( updated ? 'disable' : 'enable' );
              }
            );
          }

          var valueWatcher = SemanticUI.watcher( scope, 'model', 
            function(updated) {
              element.rating( 'set rating', updated );
            }
          );

          SemanticUI.onEvent( settings, 'onRate', 
            function(value) {
              valueWatcher.set( value );
            }
          );

          SemanticUI.linkEvents( scope, settings, $.fn.rating.settings, {
            onRate: 'onRate'
          });

          element.rating( settings );

          if ( scope.disabled ) 
          {
            element.rating( 'disable' );
          }

          if ( angular.isFunction( scope.onInit ) ) {
            scope.onInit( element );
          }
        });
      }
    };
  }]);

})( angular.module('semantic-ui') );