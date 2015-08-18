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