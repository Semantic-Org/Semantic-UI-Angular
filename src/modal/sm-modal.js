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