(function() {
  'use strict';

  angular
    .module('semantic.ui.elements.embed', ['semantic.ui.elements.embed.generator'])
    .directive('smEmbed', smEmbed);

  smEmbed.$inject = ['smEmbedGenerator'];

  function smEmbed(smEmbedGenerator) {
    return {
      restrict: 'EA',
      compile: compile
    };

    function compile(element, attrs) {
      element
        .css('display', 'block')
        .addClass('ui embed')
        .attr('tabindex', 0);

      if (attrs.placeholder) {
        element.append('<i class="video play icon"></i>' +
          '<img class="placeholder" src="' + attrs.placeholder + '">');
      }

      element.append('<div class="embed"></div>');

      return postLink;
    }

    function postLink(scope, element, attrs) {
      var
        source = attrs.source,
        id = attrs.id,
        url = attrs.url,
        params = angular.isDefined(attrs.options) ? scope.$eval(attrs.options) : {},
        iframe, generator;

      angular.forEach(attrs, function(value, key) {
        if (key.indexOf('pr') === 0) {
          params[key.replace('pr', '').toLowerCase()] = value;
        }
      });

      if (attrs.placeholder) {
        params.autoplay = 1;
      }

      // if source, id and url both present, use source and id for the embed
      if ((source && id) || url) {
        if (!(source && id)) {
          var info = smEmbedGenerator.getUrlInfo(url);

          if (!info) {
            throw new Error('Url does not match with any video source');
          }

          id = info.id;
          generator = info.generator;
        } else {
          generator = smEmbedGenerator.get(source);
        }

        iframe = generator.generate(id, params);
      } else {
        throw new Error('No source or url for video.');
      }

      if (angular.isDefined(attrs.placeholder)) {
        element.on('click', init);
        element.on('keydown', function(event) {
          if (event.which === 32) {
            event.preventDefault();
            event.stopPropagation();
            init();
          }
        });
      } else {
        init();
      }

      function init() {
        if (init.done) {
          return;
        }

        element.addClass('active');
        element.find('div').append(iframe);

        if (angular.isDefined(attrs.onReady)) {
          if (generator.getPlayer) {
            generator.getPlayer(iframe[0]).then(function(player) {
              scope.$eval(attrs.onReady, { $player: player });
            });
          }
        }

        init.done = true;
      }
    }
  }
})();
