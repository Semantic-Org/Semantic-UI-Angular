(function(app)
{

  app.directive('smShapeBind', ['SemanticUI', 
  function SemanticShapeBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smShapeBind', 'shape' );
  }]);

  var BEHAVIORS = {
    smShapeFlipUp:          'flip up',
    smShapeFlipDown:        'flip down',
    smShapeFlipLeft:        'flip left',
    smShapeFlipRight:       'flip right',
    smShapeFlipOver:        'flip over',
    smShapeFlipBack:        'flip back',
    smShapeSetNextSide:     'set next side',
    smShapeReset:           'reset',
    smShapeQueue:           'queue',
    smShapeRepaint:         'repaint',
    smShapeSetDefaultSide:  'set default side',
    smShapeSetStageSize:    'set stage size',
    smShapeRefresh:         'refresh'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'shape', method );
    }]);
  });

  app.directive('smShape', ['SemanticUI',
  function SemanticShape(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {

        settings: '=',
        onInit: '=',
        /* Events */
        onBeforeChange: '=',
        onChange: '=',
      },

      template: [
        '<div class="ui shape">',
        ' <div class="sides" ng-transclude>',
        ' </div>',
        '</div>'
      ].join('\n'),

      link: function(scope, element, attributes)
      {
        var settings = scope.settings || {};

        SemanticUI.linkSettings( scope, element, attributes, 'shape' );

        SemanticUI.linkEvents( scope, settings, $.fn.shape.settings, {
          onBeforeChange:   'onBeforeChange',
          onChange:         'onChange'
        });

        element.shape( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }

    }
  }]);

})( angular.module('semantic-ui') );