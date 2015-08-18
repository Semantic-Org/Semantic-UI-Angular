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