(function() {
  'use strict';
  angular
    .module('demo', ['semantic.ui.elements.video'])
    .config(function(smVideoGeneratorProvider) {
      smVideoGeneratorProvider.addGenerator('dailymotionGenerator');
    })
    .factory('dailymotionGenerator', function() {
      return {
        source: 'dailymotion',
        embedUrl: '//www.dailymotion.com/embed/video/'
      };
    })
    .controller('VideoDemoCtrl', function($scope, $interval) {
      $scope.options = {
        rel: 0
      };

      $scope.onReady = function(player) {
        $scope.player = player;
        $scope.duration = player.getDuration();
        $interval(function() {
          $scope.currentTime = player.getCurrentTime();
        }, 1000 / 24);
      };

    });
})();
