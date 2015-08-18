(function(app)
{

  app.directive('smProgressBind', ['SemanticUI',
  function SemanticModalBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smProgressBind', 'progress' );
  }]);

  var BEHAVIORS = {
    'smProgressIncrement': 'increment'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'progress', method );
    }]);
  });

  app.directive('smProgress', ['SemanticUI',
  function SemanticProgress(SemanticUI) 
  {
    var addText = function( scope, attributes, settings, attribute, property )
    {
      if ( angular.isDefined( attributes[ attribute ] ) )
      {
        settings.text = settings.text || {};
        settings.text[ property ] = scope[ attribute ];
      }
    };

    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Required */
        model: '=',
        /* Optional */
        total: '=',
        label: '@',
        activeText: '@',
        successText: '@',
        errorText: '@',
        warningText: '@',
        duration: '@',
        onInit: '=',
        /* Events */
        onChange: '=',
        onSuccess: '=',
        onActive: '=',
        onError: '=',
        onWarning: '='
      },

      template: [
        '<div class="ui progress">',
        '  <div class="bar">',
        '    <div class="progress" ng-show="label"></div>',
        '  </div>',
        '  <div class="label" ng-transclude></div>',
        '</div>'
      ].join('\n'),

      link: function(scope, element, attributes)
      {
        var settings = scope.settings || {};

        SemanticUI.linkSettings( scope, element, attributes, 'progress' );

        SemanticUI.linkEvents( scope, settings, $.fn.progress.settings, {
          onChange:   'onChange',
          onSuccess:  'onSuccess',
          onActive:   'onActive',
          onError:    'onError',
          onWarning:  'onWarning'
        });

        if ( !angular.isDefined( settings.showActivity ) )
        {
          settings.showActivity = false;
        }

        if ( angular.isDefined( attributes.label ) )
        {
          settings.label = scope.label;
        }

        if ( angular.isDefined( attributes.total ) )
        {
          settings.total = scope.total;
        }
        else
        {
          settings.total = 100;
        }

        if ( angular.isDefined( attributes.model ) )
        {
          settings.value = scope.model;
        }

        addText( scope, attributes, settings, 'activeText', 'active' );
        addText( scope, attributes, settings, 'successText', 'success' );
        addText( scope, attributes, settings, 'errorText', 'error' );
        addText( scope, attributes, settings, 'warningText', 'warning' );

        element.progress( settings );

        SemanticUI.watcher( scope, 'model', function(value)
        {
          var total = element.progress( 'get total' ) || 100;

          element.progress( 'set percent', value * 100 / total );
          element.progress( 'set value', value );
        });

        if ( angular.isDefined( attributes.duration ) )
        {
          SemanticUI.watcher( scope, 'duration', function(duration)
          {
            element.progress( 'set duration', duration );
          });
        }

        if ( angular.isDefined( attributes.total ) )
        {
          SemanticUI.watcher( scope, 'total', function(total)
          {
            element.progress( 'set total', total );
          });
        }

        if ( angular.isFunction( scope.onInit ) ) 
        {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );