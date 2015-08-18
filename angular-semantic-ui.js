(function(app)
{

  app.factory('SemanticUI', ['$compile',
  function SemanticUIFactory($compile) 
  {
    var SemanticUI = 
    {
      setDefaultFunction: function(scope, variable, attributes, func)
      {
        if ( !attributes[ variable ] )
        {
          scope[ variable ] = func;
        }
      },
      triggerChange: function(scope, variable, element, initialized)
      {
        scope.$watch( variable, function(updated)
        {
          // Don't trigger the change event if the element hasn't been initialized.
          if ( initialized )
          {
            // Trigger the change event during a digest cycle so any other 
            // variables that are changing this current digest cycle can finish.
            scope.$evalAsync(function()
            {
              element.trigger('change');
            });
          }

          initialized = true;
        })
      },
      bindAttribute: function(scope, variable, element, attribute)
      {
        scope.$watch( variable, function(updated)
        {
          element.attr( attribute, updated );
        });
      },
      onEvent: function(settings, evt, func)
      {
        settings[ evt ] = (function(existing, undefined) 
        {
          return function EventHandler() 
          {
            var result0 = undefined;

            if ( angular.isFunction( existing ) ) 
            {
              result0 = existing.apply( this, arguments );
            }
            
            var result1 = func.apply( this, arguments );

            return ( result0 !== undefined ? result0 : result1 );
          }
        })( settings[ evt ] );
      },
      linkEvents: function(scope, settings, defaults, linkings)
      {
        for (var evt in linkings)
        {
          (function(variable, evt)
          {
            SemanticUI.onEvent( settings, evt, function()
            {
              var scopeValue = scope[ variable ];

              if ( angular.isFunction( scopeValue ) )
              {
                return scopeValue.apply( this, arguments );
              }
              else if ( angular.isFunction( defaults[ evt ] ) )
              {
                return defaults[ evt ].apply( this, arguments );
              }
            });

          })( linkings[ evt ], evt );
        }
      },
      linkSettings: function(scope, element, attributes, module, initialized, settingsAttribute)
      {
        var settings = settingsAttribute || 'settings';
      
        if ( settings in attributes )
        {
          scope.$watch( settings, function( updated )
          {
            if ( initialized )
            {
              angular.forEach( updated, function(value, key)
              {
                element[ module ]( 'setting', key, value );
              });
            }

            initialized = true;

          }, true );
        }
      },
      createBind: function(attribute, module)
      {
        return {

          restrict: 'A',

          link: function(scope, element, attributes) 
          {
            SemanticUI.linkSettings( scope, element, attributes, module, false, attribute );
            SemanticUI.initBind( scope, element, attributes, attribute, module );
          }
        };
      },
      initBind: function(scope, element, attributes, attribute, module)
      {
        element.ready(function()
        {
          var settings = {};
          var input = attributes[ attribute ];

          if ( input )
          {
            settings = scope.$eval( input );
          }

          element[ module ]( settings );
        });
      },
      createBehavior: function(attribute, module, method)
      {
        return {

          restrict: 'A',

          link: function(scope, element, attributes) 
          {
            SemanticUI.initBehavior( scope, attributes, attribute, element, module, method );
          }
        };
      },
      initBehavior: function(scope, attributes, attribute, element, module, method)
      {
        // Default settings on the attribute.
        var settings = {
          $: undefined,
          evt: 'click',
          enabled: true,
          value: undefined
        };

        var onEvent = function() 
        {
          // If the trigger is currently enabled...
          if ( settings.enabled ) 
          {
            // Call the method on the module.
            $( settings.$ )[ module ]( method, settings.value ); 
          }
        };

        var previousEvent = false;

        scope.$watch( attributes[ attribute ], function(input)
        {
          // If the attribute value is a string, take it as the selector
          if ( angular.isString( input ) ) 
          {
            settings.$ = input;
          }
          // If the attribute value is an object, overwrite the defaults.
          else if ( angular.isObject( input ) ) 
          {
            if ( !angular.isString( input.evt ) ) input.evt = settings.evt;
            if ( !angular.isDefined( input.enabled ) ) input.enabled = settings.enabled;

            settings = input;
          }

          if ( previousEvent )
          {
            element.off( previousEvent, onEvent );
          }

          element.on( previousEvent = settings.evt, onEvent );

        }, true );
      },
      watcher: function(scope, expression, func, context, force) 
      {
        var ignoreUpdate = false;

        scope.$watch( expression, function( updated )
        {
          if ( !ignoreUpdate )
          {
            func.call( context, updated );
          }

          ignoreUpdate = false;
        });

        return {
          set: function(value)
          {
            if ( scope[ expression ] != value || force )
            {
              scope.$evalAsync(function()
              {
                scope[ expression ] = value;
                ignoreUpdate = true;
              });
            }
          },
          update: function()
          {
            scope.$evalAsync(function()
            {
              ignoreUpdate = true;
            });
          }
        }
      },
      RecursiveCompiler: function(postLink)
      {
        return function(element, link)
        {
          // Normalize the link parameter
          if( angular.isFunction( link ) )
          {
              link = { post: link };
          }

          // Break the recursion loop by removing the contents
          var contents = element.contents().remove();
          var compiledContents;

          return {
              pre: (link && link.pre) ? link.pre : null,
              /**
               * Compiles and re-adds the contents
               */
              post: function(scope, element)
              {
                  // Compile the contents
                  if( !compiledContents ) 
                  {
                      compiledContents = $compile(contents);
                  }

                  // Re-add the compiled contents to the element
                  compiledContents( scope, function(clone)
                  {
                      element.append(clone);
                  });

                  // Call the post-linking function, if any
                  if ( link && link.post )
                  {
                      link.post.apply( null, arguments );
                  }

                  if ( angular.isFunction( postLink ) )
                  {
                    postLink.apply( null, arguments );
                  }
              }
          };
        };
      }
    };

    return SemanticUI;
  }]);

})( angular.module('semantic-ui', []) );
(function(app)
{

  app.directive('smHtml', 
  function SemanticHtml() {
    return {
      restrict: 'A',
      transclude: true,
      link: function(scope, element, attributes) 
      {
        scope.$watch( attributes.smHtml, function(value) 
        {
          element.html( value );
        });
      }
    }
  });

  app.directive('smHtmlOnce', ['$parse',
  function SemanticHtmlOnce($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) 
      {
        element.html( $parse( attributes.smHtmlOnce )( scope ) );
      }
    }
  }]);

  app.directive('smClassOnce', ['$parse',
  function SemanticClassOnce($parse)
  {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) 
      {
        var classes = $parse( attributes.smClassOnce )( scope );
        
        angular.forEach( classes, function( addClass, className )
        {
          element.toggleClass( className, addClass );
        });
      }
    }
  }]);

  app.directive('smButton', 
  function SemanticButton() 
  {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<button class="ui button" ng-transclude></button>'
    };
  });

  app.directive('smMenuItem',
  function SemanticItem()
  {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        icon: '@'
      },
      template: '<a class="item"><i class="{{ icon }} icon" ng-if="icon"></i><span ng-transclude></span></a>'
    }
  });

  app.directive('smAttrs',
  function SemanticAttrs()
  {
    return {
      restrict: 'A',
      scope: {
        smAttrs: '='
      },
      link: function(scope, element, attributes) {
        angular.forEach( scope.smAttrs, function(val, key) {
          if ( angular.isNumber( val ) || angular.isString( val ) ) {
            element.attr( key, val ); 
          }
        });
      }
    }
  });

  app.directive('smLiveAttrs',
  function SemanticLiveAttrs()
  {
    return {
      restrict: 'A',
      scope: {
        smLiveAttrs: '='
      },
      link: function(scope, element, attributes) {
        var expression = function() {
          return scope.smLiveAttrs;
        };
        var setter = function() {
          angular.forEach( scope.smLiveAttrs, function(val, key) {
            if ( angular.isNumber( val ) || angular.isString( val ) ) {
              element.attr( key, val ); 
            }
          });
        };
        scope.$watch( expression, setter, true );
      }
    }
  });

  app.directive('smData',
  function SemanticData()
  {
    return {
      restrict: 'A',
      scope: {
        smData: '='
      },
      link: function(scope, element, attributes) {
        element.data( scope.smData );
      }
    }
  });

  app.directive('smLiveData',
  function SemanticLiveData()
  {
    return {
      restrict: 'A',
      scope: {
        smData: '='
      },
      link: function(scope, element, attributes) {
        var setter = function() {
          element.data( scope.smData );
        };
        scope.$watch( 'smData', setter, true );
      }
    }
  });

  app.directive('smFlatMenu', 
  function SemanticFlatMenu() {
    return {
      restrict: 'E',
      replace: true,
      template: [
        '<div class="menu">',
        '  <div class="item" ng-repeat="item in items" data-value="{{ getValue(item) }}" sm-html="label({item:item})"></div>',
        '</div>'
      ].join('\n')
    }
  });

  app.directive('smTimeAgo',
  function SemanticTimeAgo()
  {
    return {
      restrict: 'A',
      link: function(scope, element, attributes)
      {
        var timeout = false;
        var value = false;
        var fuzzy = false;

        var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var THS = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
        var HOURS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

        var getTime = function(date)
        {
          var hours = value.getHours();
          var minutes = value.getMinutes();

          return HOURS[ hours % HOURS.length ] + ':' + minutes + ( hours < 12 ? 'AM' : 'PM' );
        };

        var getTh = function(x)
        {
          return (x >= 11 && x <= 13) ? (x + 'th') : x + THS[ x % THS.length ];
        };

        var getDaysAgo = function(date)
        {
          return Math.ceil( ( new Date().getTime() - date.getTime() ) / 86400000 );
        };

        var updateText = function()
        {
          var now = new Date();
          var today = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
          var yesterday = new Date( now.getFullYear(), now.getMonth(), now.getDate() - 1 );

          var elapsed = now.getTime() - value.getTime();
          
          var text = '';
          var updateIn = false;

          if ( elapsed < 60000 ) 
          { // 1 minute
            text = 'Just now';
            updateIn = 60000 - elapsed;
          }
          else if ( elapsed < 3600000 ) 
          { // 1 hour
            var minutesAgo = Math.floor( elapsed / 60000 );
            text = minutesAgo === 1 ? '1 minute ago' : minutesAgo + ' minutes ago';
            updateIn = elapsed % 60000;
          }
          else if ( value.getTime() > today.getTime() ) 
          { // today
            text = 'Today at ' + getTime( value );
            updateIn = elapsed % 3600000;
          }
          else if ( value.getTime() > yesterday.getTime() ) 
          { // yesterday
            text = 'Yesterday at ' + getTime( value );
            updateIn = elapsed % 3600000;
          }
          else if ( value.getMonth() === now.getMonth() && value.getFullYear() === now.getFullYear() ) 
          { // this month
            text += 'The ' + getTh( value.getDate() );
            text +=' at ' + getTime( value );
            text += ' (' + getDaysAgo( value ) + ' days ago)';
            updateIn = 86400000;
          }
          else 
          { // before the current month
            text += MONTHS[ value.getMonth() ] + ' ' + getTh( value.getDate() );
            if ( value.getFullYear() !== now.getFullYear() ) {
              text += ' ' + value.getFullYear();
            }
            text += ' at ' + getTime( value );
            var daysAgo = getDaysAgo( value );
            if ( daysAgo <= 60 ) {
              text += ' (' + getDaysAgo( value ) + ' days ago)' 
            }
          }

          element.text( text );

          if ( timeout )
          {
            clearTimeout( timeout );
            timeout = false;
          }

          if ( updateIn )
          {
            timeout = setTimeout(function()
            {
              timeout = false;
              updateText();

            }, updateIn);
          }
        };

        scope.$watch( attributes.smTimeAgo, function(updated)
        {
          value = new Date( updated );
          updateText();
        });
      }
    }
  });

  app.directive('smMenu', ['SemanticUI',
  function SemanticMenu(SemanticUI)
  {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        /* Required */
        items: '=',
        label: '&',
        /* Optional */
        onClick: '&',
        children: '&',
        description: '&',
        icon: '&',
        hidden: '&',
        divider: '&'
      },
      template: [
        '<div class="menu">',
          '<div ng-repeat="i in items" ng-hide="isHidden( i )" ng-class="{item: !isDivider( i ), divider: isDivider( i )}" ng-click="onClick({item: i, $event:$event})">',
            '<i class="{{ getIcon( i ) }} icon" ng-if="getIcon( i )"></i>',
            '<span class="description" ng-if="getDescription( i )">{{ getDescription( i ) }}</span>',
            '{{ getLabel( i ) }}',
            '<sm-menu ng-if="hasChildren( i )" items="getChildren( i )" label="getLabel( item )" children="getChildren( item )" description="getDescription( item )" icon="getIcon( item )" hidden="isHidden( item )" divider="isDivider( item )" on-click="onClick({item: item, $event: $event})"></sm-menu>',
          '</div>',
        '</div>'
      ].join('\n'),
      controller: function($scope)
      {
        $scope.hasChildren = function(item) {
          var children = $scope.children({item: item});
          return children && children.length;
        };
        $scope.getChildren = function(item) {
          return $scope.children({item: item});
        };

        $scope.getLabel = function(item) {
          return $scope.label({item: item});
        };
        $scope.getIcon = function(item) {
          return $scope.icon({item: item});
        }
        $scope.getDescription = function(item) {
          return $scope.description({item: item});
        };
        $scope.isHidden = function(item) {
          return $scope.hidden({item: item});
        };
        $scope.isDivider = function(item) {
          return $scope.divider({item: item});
        };

      },
      compile: SemanticUI.RecursiveCompiler()
    };
  }]);

  app.directive('smList', ['SemanticUI',
  function SemanticList(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: 
      {
        /* Required */
        items: '=',
        /* Optional */
        description: '&',
        icon: '&',
        image: '&',
        header: '&',
        headerHref: '&',
        children: '&',
        onHeader: '&',
        /* Private */
        has: '=?'
      },

      template: [
        '<div class="ui list">',
        ' <div class="item" ng-repeat="i in items" ng-init="$ = {item: i}">',
        '   <i ng-if="has.icon" class="icon {{ icon($) }}"></i>',
        '   <img ng-if="has.image" class="ui avatar image" ng-src="{{ image($) }}">',
        '   <div ng-if="has.header || has.children" class="content">',
        '     <div ng-if="!has.headerLink" class="header" sm-html="header($)"></div>',
        '     <a ng-if="has.headerLink" class="header" ng-href="{{ headerHref($) }}" ng-click="onHeader($)" sm-html="header($)"></a>',
        '     <div class="description" sm-html="description($)"></div>',
        '     <sm-list ng-if="has.children && getChildCount($)" has="has" items="children($)" description="description({item: item})" icon="icon({item: item})" header="header({item: item})" header-href="headerHref({item: item})" children="children({item: item})" on-header="onHeader({item: item})"></sm-list>',
        '   </div>',
        '   <div ng-if="!has.header && !has.children" class="content" sm-html="description($)"></div>',
        ' </div>',
        '</div>'
      ].join('\n'),

      compile: SemanticUI.RecursiveCompiler(function(scope, element, attributes)
      {
        if ( !scope.has )
        {
          scope.has = {
            icon:         !!attributes.icon,
            image:        !!attributes.image,
            header:       !!attributes.header,
            headerLink:   !!attributes.headerHref,
            description:  !!attributes.description,
            children:     !!attributes.children
          };
        }

        scope.getChildCount = function($)
        {
          var children = scope.children($);

          return children ? children.length : 0;
        };

        SemanticUI.setDefaultFunction( scope, 'description', attributes, function(locals){return locals.item} );
        SemanticUI.setDefaultFunction( scope, 'icon', attributes, function(locals){return locals.item.icon} );
        SemanticUI.setDefaultFunction( scope, 'header', attributes, function(locals){return locals.item.header} );
        SemanticUI.setDefaultFunction( scope, 'children', attributes, function(locals){return locals.item.children} );
      })
    }
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smAccordionBind', ['SemanticUI',
  function SemanticAccordionBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smAccordionBind', 'accordion' );
  }]);

  var BEHAVIORS = {
    smAccordionOpen:        'open',
    smAccordionCloseOthers: 'close others',
    smAccordionClose:       'close',
    smAccordionToggle:      'toggle'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'accordion', method );
    }]);
  });

  app.directive('smAccordion', ['SemanticUI',
  function SemanticAccordion(SemanticUI) 
  {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        /* Optional */
        settings: '=',
        onInit: '=',
        /* Events */
        onOpening: '=',
        onOpen: '=',
        onClosing: '=',
        onClose: '=',
        onChange: '='
      },
      template: '<div class="ui accordion" ng-transclude></div>',
      link: function(scope, element, attributes)
      {
        element.ready(function()
        {
          var settings = scope.settings || {};

          SemanticUI.linkSettings( scope, element, attributes, 'accordion', true );

          SemanticUI.linkEvents( scope, settings, $.fn.accordion.settings, {
            onOpening:  'onOpening',
            onOpen:     'onOpen',
            onClosing:  'onClosing',
            onClose:    'onClose',
            onChange:   'onChange'
          });

          element.accordion( settings );

          if ( angular.isFunction( scope.onInit ) )
          {
            scope.onInit( element );
          } 
        })
      }
    };
  }]);

  app.directive('smAccordionGroup',
  function SemanticAccordionGroup() 
  {
    return {
      restrict: 'E',
      required: 'title',
      transclude: true,
      scope: {
        /* Required */
        title: '=',
        /* Optional */
        active: '='
      },
      template: [
        '<div class="title" ng-class="{active: active}">',
        '  <i class="dropdown icon"></i>',
        '  {{ title }}',
        '</div>',
        '<div class="content" ng-class="{active: active}" ng-transclude>',
        '</div>'
      ].join('\n')
    }
  });

})( angular.module('semantic-ui') );
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
(function(app)
{

  app.directive('smComments', ['SemanticUI',
  function SemanticComments(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      // transclude: true,

      scope: {
        /* Required */
        comments: '=',
        content: '&',
        /* Optional */
        avatar: '&',
        author: '&',
        date: '&',
        replies: '&',
        reply: '=',
        collapsible: '=',

        onAuthor: '&',
        onReply: '&',
        onShowReplies: '&',
        onHideReplies: '&'
      },

      template: [
        '<div class="ui comments">',
        ' <div class="comment" ng-repeat="c in comments" ng-init="$ = {comment: c}; c.$isCollapsed = true;">',
        '  <a ng-if="avatar($)" class="avatar" ng-click="onAuthor({comment: c, $event: $event})">',
        '    <img ng-src="{{ avatar($) }}">',
        '  </a>',
        '  <div class="content">',
        '   <a class="author" ng-click="onAuthor({comment: c, $event: $event})" sm-html="author($)"></a>',
        '   <div class="metadata">',
        '    <span class="date" sm-time-ago="date($)"></span>',
        '   </div>',
        '   <div class="text" sm-html="content($)"></div>',
        '   <div class="actions">',
        '     <a class="reply" ng-click="onReply({comment: c, $event: $event})" ng-if="reply">Reply</a>',
        '     <a class="show-replies" ng-if="reply && collapsible && c.$isCollapsed" href ng-click="setCollapsed(c, $event, false)" sm-html="getShowRepliesText($)"></a>',
        '     <a class="hide-replies" ng-if="reply && collapsible && !c.$isCollapsed" href ng-click="setCollapsed(c, $event, true)" sm-html="getHideRepliesText($)"></a>',
        '   </div>',
        '  </div>',
        '  <sm-comments ng-if="hasReplies($)" ng-class="{collapsed: collapsible && c.$isCollapsed}" comments="replies($)" content="content({comment: comment})" avatar="avatar({comment: comment})" author="author({comment: comment})" date="date({comment: comment})" replies="replies({comment: comment})" reply="reply" collapsible="collapsible"',
        '     on-author="onAuthor({comment: comment, $event: $event})" on-reply="onReply({comment: comment, $event: $event})" on-show-replies="onShowReplies({comment: comment, $event: $event})" on-hide-replies="onHideReplies({comment: comment, $event: $event})"></sm-comments>',
        ' </div>',
        '</div>'
      ].join('\n'),

      controller: function($scope)
      {
        $scope.setCollapsed = function(comment, $event, collapse)
        {
          var $ = {comment: comment, $event: $event};

          if ( comment.$isCollapsed != collapse )
          {
            if ( comment.$isCollapsed )
            {
              if ( $scope.onShowReplies($) !== false )
              {
                comment.$isCollapsed = false;
              }
            }
            else
            {
              if ( $scope.onHideReplies($) !== false )
              {
                comment.$isCollapsed = true;
              }
            }
          }
        };

        $scope.hasReplies = function($)
        {
          if ( !$scope.reply )
          {
            return false;
          }

          var replies = $scope.replies($);

          return replies && replies.length;
        };

        $scope.getReplyCount = function($)
        {
          if ( !$scope.reply )
          {
            return false;
          }

          var replies = $scope.replies($);

          return replies ? replies.length : 0;
        };

        $scope.getShowRepliesText = function($)
        {
          var count = $scope.getReplyCount($);

          return count === 0 ? '' : (count === 1 ? 'Show Reply' : 'Show Replies (' + count + ')');
        };

        $scope.getHideRepliesText = function($)
        {
          var count = $scope.getReplyCount($);

          return count === 0 ? '' : (count === 1 ? 'Hide Reply' : 'Hide Replies (' + count + ')');
        };
      },

      compile: SemanticUI.RecursiveCompiler()

    };
  }]);

})( angular.module('semantic-ui') );
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
(function(app)
{

  app.directive('smEmbedBind', ['SemanticUI', 
  function SemanticEmbedBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smEmbedBind', 'embed' );
  }]);

  var BEHAVIORS = {
    smEmbedReset:     'reset',
    smEmbedShow:      'show',
    smEmbedHide:      'hide',
    smEmbedDestroy:   'destroy'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'embed', method );
    }]);
  });

  app.directive('smEmbed', ['SemanticUI',
  function SemanticEmbed(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Optional */
        source: '@',
        sourceId: '@',
        url: '@',
        placeholder: '@',
        icon: '@',
        settings: '=',
        onInit: '=',
        /* Events */
        onCreate: '=',
        onDisplay: '=',
        onPlaceholderDisplay: '=',
        onEmbed: '='
      },

      template: '<div class="ui embed"></div>',

      link: function(scope, element, attributes) 
      {
        var settings = scope.settings || {};

        SemanticUI.linkSettings( scope, element, attributes, 'embed' );

        if ( scope.source ) settings.source = scope.source;
        if ( scope.sourceId ) settings.id = scope.sourceId;
        if ( scope.placeholder ) settings.placeholder = scope.placeholder;
        if ( scope.icon ) settings.icon = scope.icon;
        if ( scope.url ) settings.url = scope.url;

        SemanticUI.linkEvents( scope, settings, $.fn.embed.settings, {
          onCreate:             'onCreate',
          onDisplay:            'onDisplay',
          onPlaceholderDisplay: 'onPlaceholderDisplay',
          onEmbed:              'onEmbed'
        });

        element.embed( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smModalBind', ['SemanticUI',
  function SemanticModalBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smModalBind', 'modal' );
  }]);

  var BEHAVIORS = {
    smModalShow:        'show',
    smModalHide:        'hide',
    smModalToggle:      'toggle',
    smModalRefresh:     'refresh',
    smModalShowDimmer:  'show dimmer',
    smModalHideDimmer:  'hide dimmer',
    smModalHideOthers:  'hide others',
    smModalHideAll:     'hide all',
    smModalCacheSizes:  'cache sizes',
    smModalSetActive:   'set active'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'modal', method );
    }]);
  });

  app.directive('smModal', ['SemanticUI',
  function SemanticModal(SemanticUI) 
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
        onVisible: '=',
        onHide: '=',
        onHidden: '=',
        onApprove: '=',
        onDeny: '='
      },

      template: '<div class="ui modal" ng-transclude></div>',

      link: function(scope, element, attributes)
      {
        var settings = scope.settings || {};

        SemanticUI.linkSettings( scope, element, attributes, 'modal' );

        // If the visible attribute is specified, listen to onHide and update modal when variable changes.
        if ( attributes.visible )
        {
          var visibleWatcher = SemanticUI.watcher( scope, 'visible', 
            function(updated) {
              element.modal( updated ? 'show' : 'hide' );
            }
          );

          SemanticUI.onEvent( settings, 'onHide', 
            function() {
              visibleWatcher.set( false );
            }
          );
        }

        SemanticUI.linkEvents( scope, settings, $.fn.modal.settings, {
          onShow:    'onShow',
          onVisible: 'onVisible',
          onHide:    'onHide',
          onHidden:  'onHidden',
          onApprove: 'onApprove',
          onDeny:    'onDeny'
        });

        // Initialize the element with the given settings.
        element.modal( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    }
  }]);


})( angular.module('semantic-ui') );
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
(function(app)
{

  app.directive('smSearchBind', ['SemanticUI', 
  function SemanticSearchBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smSearchBind', 'search' );
  }]);

  var BEHAVIORS = {
    smSearchQuery:        'query',
    smSearchCancelQuery:  'cancel query',
    smSearchSearchLocal:  'search local',
    smSearchSearchRemote: 'search remote',
    smSearchSet:          'set value',
    smSearchShowResults:  'show results',
    smSearchHideResults:  'hide results',
    smSearchDestroy:      'destroy'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'search', method );
    }]);
  });

  app.directive('smSearch', ['SemanticUI',
  function SemanticSearch(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Required */
        model: '=',
        /* Optional */
        icon: '@',
        placeholder: '@',
        category: '@',
        local: '=',
        remote: '@',
        settings: '=',
        onInit: '=',
        /* Events */
        onSelect: '=',
        onResultsAdd: '=',
        onSearchQuery: '=',
        onResults: '=',
        onResultsOpen: '=',
        onResultsClose: '='
      },

      template: [
        '<div class="ui search" ng-class="{category: category}">',
        '  <div class="ui input" ng-class="{icon: icon}">',
        '    <input class="prompt" type="text" placeholder="{{ placeholder }}">',
        '    <i ng-if="icon" class="{{ icon }} icon"></i>',
        '  </div>',
        '  <div class="results"></div>',
        '</div>'
      ].join('\n'),

      link: function(scope, element, attributes) 
      {
        var settings = scope.settings || {};

        SemanticUI.linkSettings( scope, element, attributes, 'search' );

        if ( scope.local ) settings.source = scope.local;
        if ( scope.remote ) settings.apiSettings = { url: scope.remote };
        if ( scope.category ) settings.type = 'category';

        var modelWatcher = SemanticUI.watcher( scope, 'model', 
          function(value) {
            element.search( 'set value', value );
          }
        );

        SemanticUI.onEvent( settings, 'onSelect', 
          function(result, response) {
            modelWatcher.set( result );
          }
        );

        SemanticUI.linkEvents( scope, settings, $.fn.search.settings, {
          onSelect:         'onSelect',
          onResultsAdd:     'onResultsAdd',
          onSearchQuery:    'onSearchQuery',
          onResults:        'onResults',
          onResultsOpen:    'onResultsOpen',
          onResultsClose:   'onResultsClose'
        });

        element.search( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );
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
(function(app)
{

  app.directive('smSidebarBind', ['SemanticUI', 
  function SemanticSidebarBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smSidebarBind', 'sidebar' );
  }]);

  var BEHAVIORS = {
    smSidebarShow:           'show',
    smSidebarHide:           'hide',
    smSidebarToggle:         'toggle',
    smSidebarPushPage:       'push page',
    smSidebarPullPage:       'pull page',
    smSidebarAddBodyCss:     'add body css',
    smSidebarRemoveBodyCss:  'remove body css'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'sidebar', method );
    }]);
  });

  app.directive('smSidebar', ['SemanticUI',
  function SemanticSidebar(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Required */
        items: '=',
        label: '&',
        /* Optional */
        onClick: '&',
        visible: '=',
        settings: '=',
        onInit: '=',
        /* Events */
        onVisible: '=',
        onShow: '=',
        onChange: '=',
        onHide: '=',
        onHidden: '='
      },

      template: [
        '<div class="ui sidebar">',
        ' <a class="item" ng-repeat="i in items" sm-html="label({item:i})" ng-click="onClick({item:i, $event:$event})"></a>',
        '</div>'
      ].join('\n'),

      link: function(scope, element, attributes)
      {
        var settings = scope.settings || {};

        SemanticUI.setDefaultFunction( scope, 'label', attributes, function(locals){return locals.item} );

        SemanticUI.linkSettings( scope, element, attributes, 'sidebar' );

        if ( attributes.visible )
        {
          var visibleWatcher = SemanticUI.watcher( scope, 'visible', 
            function(updated) {
              element.sidebar( updated ? 'show' : 'hide' );
            }
          );

          SemanticUI.onEvent( settings, 'onHide', 
            function() {
              visibleWatcher.set( false );
            }
          );

          SemanticUI.onEvent( settings, 'onShow', 
            function() {
              visibleWatcher.set( true );
            }
          );
        }

        SemanticUI.linkEvents( scope, settings, $.fn.sidebar.settings, {
          onVisible: 'onVisible',
          onShow:    'onShow',
          onChange:  'onChange',
          onHide:    'onHide',
          onHidden:  'onHidden'
        });

        var pusher = $('.pusher');

        if ( pusher.length )
        {
          element.insertBefore( pusher );
        }

        // Initialize the element with the given settings.
        element.sidebar( settings );

        if ( scope.visible )
        {
          element.sidebar( 'show' );
        }

        if ( angular.isFunction( scope.onInit ) ) 
        {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );
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
(function(app)
{

  app.directive('smTabBind', ['SemanticUI', 
  function SemanticTabBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smTabBind', 'tab' );
  }]);

  var BEHAVIORS = {
    smTabSet:       'change tab'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'tab', method );
    }]);
  });

  app.directive('smTabMenu', ['SemanticUI', 
  function SemanticTabMenu(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Required */
        tabs: '=',
        /* Optional */
        active: '=?',
        settings: '='
      },

      template: [
        '<div class="ui menu">',
        '  <a class="item" ng-repeat="(name, title) in tabs" ng-class="{active: name === active}" data-tab="{{ name }}" sm-html="title"></a>',
        '</div>'
      ].join('\n'),

      link: function(scope, element, attributes)
      {
        var setActiveTab = function( tab )
        {
          if ( tab )
          {
            element.tab( 'change tab', tab );
          }
        };

        element.ready(function()
        {
          var settings = scope.settings || {};
          var elements = element.children('.item');
          var hasActive = !!attributes.active;

          SemanticUI.linkSettings( scope, elements, attributes, 'tab', true );

          if ( hasActive )
          {
            var activeWatcher = SemanticUI.watcher( scope, 'active', 
              function( tab ) {
                setActiveTab( tab );
              }
            );

            SemanticUI.onEvent( settings, 'onVisible', 
              function(tab) {
                activeWatcher.set( tab );
              }
            );
          }

          elements.tab( settings );

          if ( hasActive ) 
          {
            setActiveTab( scope.active );
          }
        });
      }
    }
  }]);

  app.directive('smTab', ['SemanticUI',
  function SemanticTab(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        name: '@'
      },

      template: '<div class="ui tab" data-tab="{{ name }}" ng-transclude></div>'
    };
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  // Transitions: scale, fade, flip, drop, fly, swing, browse, slide, jiggle, flash, shake, pulse, tada, bounce

  app.directive('smTransition', ['SemanticUI',
  function SemanticTransition(SemanticUI)
  {
    return {

      restrict: 'A',

      scope: {
        smTransition: '@',
        smTransitionEvents: '@',
        smTransitionOther: '@'
      },

      link: function(scope, element, attributes)
      {
        scope.smTransitionEvents = scope.smTransitionEvents || 'click';
        
        element.on( scope.smTransitionEvents, function()
        {
          ( scope.smTransitionOther ? $( scope.smTransitionOther ) : element ).transition( scope.smTransition );
        });
      }
    };
    
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smPopupBind', ['SemanticUI',
  function SemanticModalBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smPopupBind', 'popup' );
  }]);

  var BEHAVIORS = {
    smPopupShow:        'show',
    smPopupHide:        'hide',
    smPopupHideAll:     'hide all',
    smPopupToggle:      'toggle',
    smPopupReposition:  'reposition',
    smPopupDestroy:     'destroy',
    smPopupRemove:      'remove popup'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'popup', method );
    }]);
  });

  // An attribute directive which displays a popup for this element.
  app.directive('smPopup', ['SemanticUI',
  function SemanticPopup(SemanticUI)
  {
    return {
      restrict: 'A',
      scope: {
        /* Required */
        smPopup: '=',
        /* Optional */
        smPopupTitle: '=',
        smPopupHtml: '=',
        smPopupPosition: '@',
        smPopupVariation: '@',
        smPopupSettings: '=',
        smPopupOnInit: '=',
        /* Events */
        smPopupOnCreate: '=',
        smPopupOnRemove: '=',
        smPopupOnShow: '=',
        smPopupOnVisible: '=',
        smPopupOnHide: '=',
        smPopupOnHidden: '='
      },
      link: function(scope, element, attributes) 
      {
        var settings = scope.smPopupSettings || {};

        SemanticUI.linkSettings( scope, element, attributes, 'popup', false, 'smPopupSettings' );

        SemanticUI.bindAttribute( scope, 'smPopup', element, 'data-content' );
        SemanticUI.bindAttribute( scope, 'smPopupTitle', element, 'data-title' );
        SemanticUI.bindAttribute( scope, 'smPopupHtml', element, 'data-html' );
        SemanticUI.bindAttribute( scope, 'smPopupPosition', element, 'data-position' );
        SemanticUI.bindAttribute( scope, 'smPopupVariation', element, 'data-variation' );

        SemanticUI.linkEvents( scope, settings, {
          onCreate:  'smPopupOnCreate',
          onRemove:  'smPopupOnRemove',
          onShow:    'smPopupOnShow',
          onVisible: 'smPopupOnVisible',
          onHide:    'smPopupOnHide',
          onHidden:  'smPopupOnHidden'
        });

        element.popup( settings );

        if ( angular.isFunction( scope.smPopupOnInit ) ) 
        {
          scope.smPopupOnInit( element );
        }
      }
    };
  }]);

  // An attribute directive to show the detached popup which follows this element.
  app.directive('smPopupInline', ['SemanticUI',
  function SemanticPopupInline(SemanticUI) 
  {
    return {
      restrict: 'A',
      scope: {
        /* Optional */
        smPopupInline: '=',
        smPopupInlineOnInit: '=',
        /* Events */
        smPopupInlineOnCreate: '=',
        smPopupInlineOnRemove: '=',
        smPopupInlineOnShow: '=',
        smPopupInlineOnVisible: '=',
        smPopupInlineOnHide: '=',
        smPopupInlineOnHidden: '='
      },
      link: function(scope, element, attributes) 
      {
        var settings = scope.smPopupInline || {};

        SemanticUI.linkSettings( scope, element, attributes, 'popup', false, 'smPopupInline' );

        SemanticUI.linkEvents( scope, settings, {
          onCreate:  'smPopupInlineOnCreate',
          onRemove:  'smPopupInlineOnRemove',
          onShow:    'smPopupInlineOnShow',
          onVisible: 'smPopupInlineOnVisible',
          onHide:    'smPopupInlineOnHide',
          onHidden:  'smPopupInlineOnHidden'
        });

        settings.inline = true;

        element.popup( settings );

        if ( angular.isFunction( scope.smPopupInlineOnInit ) ) {
          scope.smPopupInlineOnInit( element );
        }
      }
    };
  }]);

  // An attribute directive to show a detached popup over this element given it's name.
  app.directive('smPopupDisplay', ['SemanticUI',
  function SemanticPopupDisplay(SemanticUI) 
  {
    return {
      restrict: 'A',
      scope: {
        /* Required */
        smPopupDisplay: '@',
        /* Optional */
        smPopupDisplaySettings: '=',
        smPopupDisplayOnInit: '=',
        /* Events */
        smPopupDisplayOnCreate: '=',
        smPopupDisplayOnRemove: '=',
        smPopupDisplayOnShow: '=',
        smPopupDisplayOnVisible: '=',
        smPopupDisplayOnHide: '=',
        smPopupDisplayOnHidden: '='
      },
      link: function(scope, element, attributes) 
      {
        var settings = scope.smPopupDisplaySettings || {};

        SemanticUI.linkSettings( scope, element, attributes, 'popup', false, 'smPopupDisplaySettings' );

        SemanticUI.linkEvents( scope, settings, $.fn.popup.settings, {
          onCreate:  'smPopupDisplayOnCreate',
          onRemove:  'smPopupDisplayOnRemove',
          onShow:    'smPopupDisplayOnShow',
          onVisible: 'smPopupDisplayOnVisible',
          onHide:    'smPopupDisplayOnHide',
          onHidden:  'smPopupDisplayOnHidden'
        });

        settings.popup = '[data-popup-named="' + attributes.smPopupDisplay + '"]';

        element.popup( settings );

        if ( angular.isFunction( scope.smPopupDisplayOnInit ) ) {
          scope.smPopupDisplayOnInit( element );
        }
      }
    };
  }]);

  // An element directive for a popup, can be used after an element or can be named and used with sm-popup-display.
  app.directive('smPopupDetached', 
  function SemanticPopupDetached() 
  {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        name: '@'
      },
      template: '<div class="ui popup" data-popup-named="{{ name }}" ng-transclude></div>'
    };
  });

})( angular.module('semantic-ui') );
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