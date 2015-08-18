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