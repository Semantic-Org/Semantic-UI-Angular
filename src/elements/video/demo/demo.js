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
        $scope.youtube = {
          player: player,
          duration: player.getDuration()
        };
        $interval(function() {
          $scope.youtube.currentTime = player.getCurrentTime();
        }, 1000 / 24);
      };

      $scope.onVimeoReady = function(player) {
        $scope.vimeo = {
          player: player
        };
        player.api('getDuration', function(value, player_id) {
          $scope.vimeo.duration = value;
        });
        $interval(function() {
          player.api('getCurrentTime', function(value, player_id) {
            $scope.vimeo.currentTime = value;
          });
        }, 1000 / 24);
      };

    });
})();
