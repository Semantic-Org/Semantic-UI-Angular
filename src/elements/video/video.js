(function() {
  'use strict';

  angular
    .module('semantic.ui.elements.video', ['semantic.ui.elements.video.generator'])
    .directive('smVideo', smVideo);

  smVideo.$inject = ['smVideoGenerator'];

  function smVideo(smVideoGenerator) {
    return {
      restrict: 'EA',
      replace: true,
      template: setTemplate,
      link: function(scope, element, attrs) {
        var
          source = attrs.source,
          id = attrs.id,
          url = attrs.url,
          params = angular.isDefined(attrs.options) ? scope.$eval(attrs.options) : {},
          embedHtml;

        angular.forEach(attrs, function(value, key) {
          if (key.indexOf('pr') === 0) {
            params[key.replace('pr', '').toLowerCase()] = value;
          }
        });

        if (attrs.placeholder) {
          params.autoplay = 1;
        }

        if ((source && id) || url) {
          embedHtml = (source && id) ?
            smVideoGenerator.get(source).generate(id, params) :
            smVideoGenerator.generateFromUrl(url, params);
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
          if (init.done) return;

          element.addClass('active');
          element.find('div').html(embedHtml);
          init.done = true;
        }
      }
    };
  }

  function setTemplate(element, attrs) {
    var html = '<div class="ui video" tabindex="0">';
    if (attrs.placeholder) {
      html += '' +
        '<i class="video play icon"></i>' +
        '<img class="placeholder" src="' + attrs.placeholder + '">';
    }
    html += '<div class="embed"></div></div>';
    return html;
  }
})();
