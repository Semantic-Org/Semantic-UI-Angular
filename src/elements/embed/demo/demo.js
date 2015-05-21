(function() {
  'use strict';
  angular
    .module('demo', ['semantic.ui.elements.embed'])
    .config(function(smEmbedGeneratorProvider) {
      smEmbedGeneratorProvider.addGenerator('dailymotionGenerator');
    })
    .factory('dailymotionGenerator', function() {
      return {
        source: 'dailymotion',
        url: '//www.dailymotion.com/embed/video/{id}'
      };
    })
    .controller('EmbedDemoCtrl', function($interval) {
      var self = this;

      self.options = {
        rel: 0
      };

      self.onReady = function(player) {
        self.youtube = {
          player: player,
          duration: player.getDuration()
        };
        $interval(function() {
          self.youtube.currentTime = player.getCurrentTime();
        }, 1000 / 24);
      };

      self.onVimeoReady = function(player) {
        self.vimeo = {
          player: player
        };
        player.api('getDuration', function(value) {
          self.vimeo.duration = value;
        });
        $interval(function() {
          player.api('getCurrentTime', function(value) {
            self.vimeo.currentTime = value;
          });
        }, 1000 / 24);
      };

    });
})();
