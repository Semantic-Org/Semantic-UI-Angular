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