(function(app)
{

  app.directive('smDropdownBind', ['SemanticUI',
  function SemanticDropdownBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smDropdownBind', 'dropdown' );
  }]);

  var BEHAVIORS = {
    smDropdownToggle:               'toggle',
    smDropdownShow:                 'show',
    smDropdownHide:                 'hide',
    smDropdownClear:                'clear',
    smDropdownHideOthers:           'hide others',
    smDropdownRestoreDefaults:      'restore defaults',
    smDropdownRestoreDefaultText:   'restore default text',
    smDropdownRestoreDefaultValue:  'restore default value',
    smDropdownSaveDefaults:         'save defaults',
    smDropdownSetSelected:          'set selected',
    smDropdownSetText:              'set text',
    smDropdownSetValue:             'set value',
    smDropdownBindTouchEvents:      'bind touch events',
    smDropdownMouseEvents:          'mouse events',
    smDropdownBindIntent:           'bind intent',
    smDropdownUnbindIntent:         'unbind intent',
    smDropdownSetActive:            'set active',
    smDropdownSetVisible:           'set visible',
    smDropdownRemoveActive:         'remove active',
    smDropdownRemoveVisible:        'remove visible'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'dropdown', method );
    }]);
  });

  app.directive('smDropdown', ['SemanticUI',
  function SemanticDropdown(SemanticUI) 
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Required */
        model: '=',
        items: '=',
        label: '&',
        value: '&',
        /* Optional */
        settings: '=',
        defaultText: '=',
        onInit: '=',
        emptyValue: '=',
        /* Events */
        onChange: '=',
        onAdd: '=',
        onRemove: '=',
        onLabelCreate: '=',
        onLabelSelect: '=',
        onNoResults: '=',
        onShow: '=',
        onHide: '='
      },

      template: [
        '<div class="ui dropdown">',
          '<div class="text" sm-class-once="{default: hasDefault()}" sm-html-once="getDefaultText()"></div>',
          '<i class="dropdown icon"></i>',
          '<sm-flat-menu></sm-flat-menu>',
        '</div>'
      ].join('\n'),

      controller: function($scope) 
      {
        var hashMap = {};

        // Returns the value to be placed in the data-value attribute. If the computed value has a $$hashKey,
        // then return the hashKey. This enables the exact instance of the item to be set to the model.
        $scope.getValue = function(item)
        {
          // Computes the value given the expression in the 'value' attribute
          return $scope.getKey( $scope.value( {item: item} ) );
        };

        $scope.getKey = function(value)
        {
          return (value ? value.$$hashKey || value : value) + '';
        };

        $scope.isEmpty = function()
        {
          return !$scope.model || $scope.model.length === 0;
        };

        // Translates the value (the model, an item of the model, or a variable 
        // created from the value function) into the key that's stored on the dropdown.
        $scope.translateValue = function(value)
        {
          var translated = $scope.getKey( value );
          var matching = $scope.findMatchingItem( translated );

          if ( angular.isDefined( matching ) )
          {
            return $scope.getValue( matching );
          }
        };

        // Determines whether this dropdown should currently display the default text.
        $scope.hasDefault = function() 
        {
          return ( $scope.defaultText && $scope.isEmpty() );
        }; 

        // Gets the current text for the drop down. If the current model has a value which is found
        // in the items, the appropriate item's label is displayed. Otherwise return the default text.
        $scope.getDefaultText = function() 
        {
          return ( $scope.isEmpty() ? $scope.defaultText : '' );
        };

        // Finds an item instance that has the exact same value as the given value.
        $scope.findMatchingItem = function(value) 
        {
          return hashMap[ value ];
        };

        // Updates the hash map providing a mapping from values to items.
        $scope.updateHashMap = function( items )
        {
          hashMap = {};

          angular.forEach( items, function(item)
          {
            hashMap[ $scope.getValue( item ) ] = item;
          });
        };
      },
      link: function(scope, element, attributes) 
      {
        var applyValue = function( value )
        {
          if ( element.dropdown('is multiple') )
          {
            if ( value instanceof Array )
            {
              var translatedValue = [];

              for (var i = 0; i < value.length; i++)
              {
                var translated = scope.translateValue( value[ i ] );

                if ( angular.isDefined( translated ) )
                {
                  translatedValue.push( translated );
                }
              }

              element.dropdown( 'set exactly', translatedValue );
            }
          }
          else
          {
            element.dropdown( 'set selected', scope.translateValue( value ) );
          }
        };

        SemanticUI.setDefaultFunction( scope, 'label', attributes, function(locals){return locals.item} );
        SemanticUI.setDefaultFunction( scope, 'value', attributes, function(locals){return locals.item} );
        
        element.ready(function()
        {
          var settings = scope.settings || {};
          var ignoreChange = true;

          SemanticUI.linkSettings( scope, element, attributes, 'dropdown', true );

          SemanticUI.triggerChange( scope, 'model', element, true );

          // Returns the model on the scope, converting it to an array if it's not one.
          var modelArray = function() {
            if ( !(scope.model instanceof Array) ) {
              scope.model = scope.model ? [ scope.model ] : [];
            }
            return scope.model;
          };

          // When the model changes, set the value on the drop down
          var modelWatcher = SemanticUI.watcher( scope, 'model', 
            function(updated) {
              applyValue( updated );
            }
          , null, true );

          // Inject an onChange function into the settings which sets the model value
          // and causes the scope to be updated.
          SemanticUI.onEvent( settings, 'onChange', 
            function(value) {
              if ( ignoreChange ) {
                return;
              }
              if ( !element.dropdown('is multiple') ) {
                var mapped = scope.findMatchingItem( value );
                if (angular.isDefined(mapped)) {
                  var mappedValue = scope.value({item: mapped});
                  modelWatcher.set( mappedValue );
                } else if ( element.dropdown('setting', 'allowAdditions') ) {
                  modelWatcher.set( value );
                } else {
                  modelWatcher.set( scope.emptyValue );
                }
              }
            }
          );

          // When a new item is selected for multiple selection dropdowns, add it to the model.
          SemanticUI.onEvent( settings, 'onAdd',
            function(value) {
              if ( ignoreChange ) {
                return;
              }
              var mapped = scope.findMatchingItem( value );
              if (angular.isDefined(mapped)) {
                var mappedValue = scope.value({item: mapped});
                var indexOf = $.inArray( mappedValue, modelArray() );
                if ( indexOf === -1 ) {
                  scope.model.push( mappedValue );
                  modelWatcher.update();
                }
              } else if ( element.dropdown('setting', 'allowAdditions') ) {
                scope.model.push( value );
                modelWatcher.update();
              }
            }
          );

          // When an item is deselected for multiple selection dropdowns, remove it from the model.
          SemanticUI.onEvent( settings, 'onRemove',
            function(value) {
              if ( ignoreChange ) {
                return;
              }
              var mapped = scope.findMatchingItem( value );
              if (angular.isDefined(mapped)) {
                var mappedValue = scope.value({item: mapped});
                var indexOf = $.inArray( mappedValue, modelArray() );
                if ( indexOf !== -1 ) {
                  scope.model.splice( indexOf, 1 );
                  modelWatcher.update();
                } 
              } else {
                var indexOf = $.inArray( value, modelArray() );
                if ( indexOf !== -1 ) {
                  scope.model.splice( indexOf, 1 );
                  modelWatcher.update();
                }
              }
            }
          );

          SemanticUI.linkEvents( scope, settings, $.fn.dropdown.settings, {
            onChange:       'onChange',
            onAdd:          'onAdd',
            onRemove:       'onRemove',
            onLabelCreate:  'onLabelCreate',
            onLabelSelect:  'onLabelSelect',
            onNoResults:    'onNoResults',
            onShow:         'onShow',
            onHide:         'onHide'
          });

          // When items changes, rebuild the hashMap & reapply the values.
          scope.$watch( 'items', function( updated ) 
          {
            scope.updateHashMap( scope.items );
            applyValue( scope.model );

          }, true );

          // Initialize the element with the given settings.
          element.dropdown( settings );

          // Update the hashmap with items
          scope.updateHashMap( scope.items );

          // Apply current value
          applyValue( scope.model );

          // Save defaults
          element.dropdown( 'save defaults' );

          // Stop ignoring changes!
          ignoreChange = false;

          // Notify initialized callback.
          if ( angular.isFunction( scope.onInit ) ) 
          {
            scope.onInit( element );
          }

        });
      }
    }
  }]);

})( angular.module('semantic-ui') );