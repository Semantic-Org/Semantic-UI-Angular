(function(app)
{

  app.directive('smCheckboxBind', ['SemanticUI',
  function SemanticCheckboxBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smCheckboxBind', 'checkbox' );
  }]);

  var BEHAVIORS = {
    smCheckboxToggle:            'toggle',
    smCheckboxCheck:             'check',
    smCheckboxUncheck:           'uncheck',
    smCheckboxIndeterminate:     'indeterminate',
    smCheckboxDeterminate:       'determinate',
    smCheckboxEnable:            'enable',
    smCheckboxDisable:           'disable'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'checkbox', method );
    }]);
  });

  app.directive('smCheckbox', ['SemanticUI',
  function SemanticCheckbox(SemanticUI) 
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Required */
        model: '=',
        label: '@',
        /* Optional */
        settings: '=',
        enabled: '=',
        indeterminateValue: '=',
        checkedValue: '=',
        uncheckedValue: '=',
        children: '@',
        onInit: '=',
        /* Events */
        onChange:        '=',
        onChecked:       '=',
        onIndeterminate: '=',
        onDeterminate:   '=',
        onUnchecked:     '=',
        onEnable:        '=',
        onDisable:       '='
      },

      template: [
        '<div class="ui checkbox">',
        '  <input type="checkbox">',
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

          var checkedValue = function() {
            return angular.isDefined( scope.checkedValue ) ? scope.checkedValue : true;
          };
          var uncheckedValue = function() {
            return angular.isDefined( scope.uncheckedValue ) ? scope.uncheckedValue : false;
          };
          var indeterminateValue = function() {
            return angular.isDefined( scope.indeterminateValue ) ? scope.indeterminateValue : void 0;
          };

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
              if ( angular.isDefined( updated ) ) {
                element.checkbox( updated ? 'set checked' : 'set unchecked' );
              }
            }
          );

          SemanticUI.onEvent( settings, 'onChecked', 
            function() {
              modelWatcher.set( checkedValue() );
            }
          );

          SemanticUI.onEvent( settings, 'onUnchecked', 
            function() {
              modelWatcher.set( uncheckedValue() );
            }
          );

          SemanticUI.onEvent( settings, 'onIndeterminate', 
            function() {
              modelWatcher.set( indeterminateValue() );
            }
          );

          SemanticUI.linkEvents( scope, settings, $.fn.checkbox.settings, {
            onChange:        'onChange',
            onChecked:       'onChecked',
            onIndeterminate: 'onIndeterminate',
            onDeterminate:   'onDeterminate',
            onUnchecked:     'onUnchecked',
            onEnable:        'onEnable',
            onDisable:       'onDisable'
          });

          // If the checkbox has children, link the value of this checkbox to the children
          if ( scope.children )
          {
            var $children = $( scope.children );
            var settingChildren = false;

            SemanticUI.onEvent( settings, 'onChecked',
              function() {
                settingChildren = true;
                $children.checkbox( 'check' );
                settingChildren = false;
              }
            );
            SemanticUI.onEvent( settings, 'onUnchecked',
              function() {
                settingChildren = true;
                $children.checkbox( 'uncheck' );
                settingChildren = false;
              }
            );

            $children.children('input[type=checkbox], input[type=radio]')
              .change(function() {

                if ( settingChildren ) {
                  return;
                }

                var checked = 0;

                $children.each(function(i, child) {
                  if ( $( child ).checkbox( 'is checked') ) {
                    checked++;
                  }
                });

                if ( checked === 0 ) {
                  element.checkbox( 'uncheck' );
                } 
                else if ( checked === $children.length ) {
                  element.checkbox( 'check' );
                }
                else {
                  element.checkbox( 'indeterminate' );
                }
              })
            ;
          }

          // Initialize the element with the given settings.
          element.checkbox( settings ); 

          // Set initial state of the checkbox
          if ( scope.model == checkedValue() )
          {
            element.checkbox( 'set checked' );
          }
          else if ( scope.model === indeterminateValue() )
          {
            element.checkbox( 'set indeterminate' );
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