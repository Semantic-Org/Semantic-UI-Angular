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