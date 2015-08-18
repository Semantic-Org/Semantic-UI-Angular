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