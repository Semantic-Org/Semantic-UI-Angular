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
    .controller('VideoDemoCtrl', function($scope) {
      $scope.options = {
        rel: 0
      };
    });
})();
