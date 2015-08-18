(function(app)
{

  app.directive('smDimmerBind', ['SemanticUI', 
  function SemanticDimmerBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smDimmerBind', 'dimmer' );
  }]);

  var BEHAVIORS = {
    smDimmerShow:           'show',
    smDimmerHide:           'hide',
    smDimmerToggle:         'toggle'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'dimmer', method );
    }]);
  });

  app.directive('smDimmer', ['SemanticUI',
  function SemanticDimmer(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Optional */
        visible: '=',
        settings: '=',
        onInit: '=',
        /* Events */
        onShow: '=',
        onHide: '=',
        onChange: '='
      },

      template: '<div class="ui dimmer" ng-transclude></div>',

      link: function(scope, element, attributes) 
      {
        var settings = scope.settings || {};

        SemanticUI.linkSettings( scope, element, attributes, 'dimmer' );

        // If the visible attribute is specified, listen to onHide and update modal when variable changes.
        if ( attributes.visible )
        {
          var visibleWatcher = SemanticUI.watcher( scope, 'visible', 
            function(updated) {
              element.dimmer( updated ? 'show' : 'hide' );
            }
          );

          SemanticUI.onEvent( settings, 'onShow', 
            function(value) {
              visibleWatcher.set( true );
            }
          );

          SemanticUI.onEvent( settings, 'onHide', 
            function(value) {
              visibleWatcher.set( false );
            }
          );
        }

        SemanticUI.linkEvents( scope, settings, $.fn.dimmer.settings, {
          onShow:   'onShow',
          onHide:   'onHide',
          onChange: 'onChange'
        });

        element.dimmer( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );