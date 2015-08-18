(function(app)
{

  app.directive('smRadioBind', ['SemanticUI',
  function SemanticRadioBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smRadioBind', 'checkbox' );
  }]);

  var BEHAVIORS = {
    smRadioCheck:             'check',
    smRadioEnable:            'enable',
    smRadioDisable:           'disable'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'checkbox', method );
    }]);
  });

  app.directive('smRadio', ['SemanticUI',
  function SemanticRadio(SemanticUI) 
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Required */
        model: '=',
        label: '@',
        name: '@',
        value: '=',
        /* Optional */
        settings: '=',
        enabled: '=',
        onInit: '=',
        /* Events */
        onChange:        '=',
        onChecked:       '=',
        onUnchecked:     '=',
        onEnable:        '=',
        onDisable:       '='
      },

      template: [
        '<div class="ui radio checkbox">',
        '  <input name="{{ name }}" type="radio">',
        '  <label>{{ label }}</label>',
        '</div>'
      ].join('\n'),

      link: function(scope, element, attributes) 
      {
        element.ready(function()
        {
          var settings = scope.settings || {};

          SemanticUI.linkSettings( scope, element, attributes, 'checkbox', true );

          SemanticUI.triggerChange( scope, 'model', element, true );

          if ( attributes.enabled )
          {
            var enabledWatcher = SemanticUI.watcher( scope, 'enabled',
              function(updated) {
                if ( angular.isDefined( updated ) ) {
                  element.checkbox( updated ? 'set enabled' : 'set disabled' ); 
                }
              }
            );

            SemanticUI.onEvent( settings, 'onEnable', 
              function(value) {
                enabledWatcher.set( true );
              }
            );

            SemanticUI.onEvent( settings, 'onDisable', 
              function(value) {
                enabledWatcher.set( false );
              }
            );
          }

          var modelWatcher = SemanticUI.watcher( scope, 'model', 
            function(updated) {
              if ( updated === scope.value ) {
                element.checkbox( 'set checked' );
              }
            }
          );

          SemanticUI.onEvent( settings, 'onChecked', 
            function() {
              modelWatcher.set( scope.value );
            }
          );

          SemanticUI.linkEvents( scope, settings, $.fn.checkbox.settings, {
            onChange:        'onChange',
            onChecked:       'onChecked',
            onUnchecked:     'onUnchecked',
            onEnable:        'onEnable',
            onDisable:       'onDisable'
          });

          // Initialize the element with the given settings.
          element.checkbox( settings ); 

          // Set initial state of the radio
          if ( scope.model === scope.value )
          {
            element.checkbox( 'set checked' );
          }

          // If the radio is a slider, remove the radio class 
          if ( element.hasClass( 'slider' ) )
          {
            element.removeClass( 'radio' );
          }

          if ( angular.isDefined( scope.enabled ) && !scope.enabled )
          {
            element.checkbox( 'set disabled' );
          }

          if ( angular.isFunction( scope.onInit ) ) {
            scope.onInit( element );
          }
        });
      }
    }
  }]);

})( angular.module('semantic-ui') );