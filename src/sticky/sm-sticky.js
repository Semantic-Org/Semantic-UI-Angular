(function(app)
{

  app.directive('smStickyBind', ['SemanticUI', 
  function SemanticStickyBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smStickyBind', 'sticky' );
  }]);

  var BEHAVIORS = {
    smStickyRefresh:   'refresh'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'sticky', method );
    }]);
  });

  app.directive('smSticky', ['SemanticUI',
  function SemanticSticky(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Optional */
        context: '@',
        settings: '=',
        onInit: '=',
        /* Events */
        onReposition: '=',
        onScroll: '=',
        onStick: '=',
        onUnstick: '=',
        onTop: '=',
        onBottom: '='
      },

      template: '<div class="ui sticky" ng-transclude></div>',

      link: function(scope, element, attributes) 
      {
        element.ready(function()
        {
          var settings = scope.settings || {};

          SemanticUI.linkSettings( scope, element, attributes, 'sticky', true );

          SemanticUI.linkEvents( scope, settings, $.fn.sticky.settings, {
            onReposition:   'onReposition',
            onScroll:       'onScroll',
            onStick:        'onStick',
            onStick:        'onStick',
            onTop:          'onTop',
            onBottom:       'onBottom'
          });

          if ( !settings.context )
          {
            settings.context = scope.context;
          }

          element.sticky( settings );

          if ( angular.isFunction( scope.onInit ) ) 
          {
            scope.onInit( element );
          }
        });
      }
    };
  }]);

})( angular.module('semantic-ui') );