(function() {
  'use strict';

  angular
    .module('semantic.ui.elements.embed.generator', [])
    .provider('smEmbedGenerator', smEmbedGenerator)
    .provider('smEmbedYoutube', smEmbedYoutube)
    .provider('smEmbedVimeo', smEmbedVimeo)
    .factory('smEmbedAnyContent', smEmbedAnyContent);

  function smEmbedGenerator() {
    var generatorNames = ['smEmbedYoutube', 'smEmbedVimeo', 'smEmbedAnyContent'];

    this.addGenerator = function(serviceName) {
      if (generatorNames.indexOf(serviceName) === -1) {
        generatorNames.unshift(serviceName);
      }
    };

    this.$get = ['$injector', '$log', function ($injector, $log) {
      var
        seen = [],
        generators = generatorNames.map(function(name) {
          var def = $injector.get(name);
          if (seen.indexOf(def.source) !== -1) {
            throw new Error('Duplicate generator source value: ' + def.source);
          } else {
            seen.push(def.source);
          }
          return new Generator(def);
        });

      function get(source) {
        return generators.filter(function(gen) {
          return gen.source === source;
        })[0];
      }

      function getUrlInfo(url) {
        var res = [];

        generators.forEach(function(gen) {
          var id = angular.isFunction(gen.getIdFromUrl) && gen.getIdFromUrl(url);
          if (id) {
            res.push({
              generator: gen,
              id: id
            });
          }
        });
        if (res.length > 2) {
          $log.warn('Url matches multiple video sources: ' +
            res.map(function(info) { return info.generator.source; }) +
            '. Used source: ' + res[0].generator.source);
        }
        return res[0];
      }

      return {
        get: get,
        getUrlInfo: getUrlInfo
      };
    }];
  }

  function Generator(definition) {
    if (!definition.source) {
      throw new Error('Source is missing from generator definition');
    }
    if (!definition.url) {
      throw new Error('Embed url is missing from generator definition');
    }
    angular.extend(this, definition);
  }

  Generator.prototype.generateParams = function(params) {
    var finalParams = {}, url = '';

    if (this.defaultParams) {
      angular.extend(finalParams, this.defaultParams);
    }
    angular.extend(finalParams, params);
    angular.forEach(finalParams, function(value, key) {
       url += '&amp;' + key + '=' + value;
    });

    return url;
  };

  Generator.prototype.generate = function(id, params) {
    var html = '' +
      '<iframe src="'+ this.url.replace('{id}', id) + '?=' + this.generateParams(params) + '"' +
      ' width="100%" height="100%"' +
      ' frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
    return angular.element(html);
  };

  function smEmbedYoutube() {
    var defaultParams = {
      modestbranding: 1,
      cc_load_policy: 1,
      autohide: 0
    };

    this.extendDefaultParams = function (params) {
      angular.extend(defaultParams, params);
    };

    this.$get = ['$window', '$q', function($window, $q) {
      /**
       * @group1 the video ID (always)
       */
      var regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

      function getId(url) {
        var matches = url.match(regExp);
        return matches && matches[1];
      }

      function loadApi() {
        loadApi.promise = loadApi.promise || $q(function(resolve) {
          if ($window.YT) {
            resolve();
          } else {
            loadScript('https://www.youtube.com/iframe_api');

            $window.onYouTubeIframeAPIReady = function() {
              resolve();
            };
          }
        });
        return loadApi.promise;
      }

      function getPlayer(element) {
        return $q(function(resolve) {
          loadApi().then(function() {
            new $window.YT.Player(element, {
              events: {
                onReady: function(event) {
                  resolve(event.target);
                }
              }
            });
          });
        });
      }

      return {
        defaultParams: defaultParams,
        source: 'youtube',
        url: '//www.youtube.com/embed/{id}',
        getIdFromUrl: getId,
        getPlayer: getPlayer
      };
    }];
  }

  function smEmbedVimeo() {
    var defaultParams = {};

    this.extendDefaultParams = function (params) {
      angular.extend(defaultParams, params);
    };

    this.$get = ['$window', '$q', function($window, $q) {
      /**
       * @group1 the video group name (if present)
       * @group2 the album ID (if present)
       * @group3 the video ID (always)
       */
      var regExp = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;

      function getId(url) {
        var matches = url.match(regExp);
        return matches && matches[3];
      }

      function loadApi() {
        loadApi.promise = loadApi.promise || $q(function(resolve) {
          if ($window.Froogaloop && $window.$f) {
            resolve();
          } else {
            loadScript('//secure-a.vimeocdn.com/js/froogaloop2.min.js', function() {
              resolve();
            });
          }
        });
        return loadApi.promise;
      }

      function getPlayer(element) {
        return $q(function(resolve) {
          loadApi().then(function() {
            var player = $window.$f(element);
            player.addEvent('ready', function() {
              resolve(player);
            });
          });
        });
      }

      return {
        defaultParams: defaultParams,
        source: 'vimeo',
        url: '//player.vimeo.com/video/{id}',
        getIdFromUrl: getId,
        getPlayer: getPlayer
      };
    }];
  }

  function smEmbedAnyContent() {
    return {
      source: 'any',
      url: '{id}',
      getIdFromUrl: getId
    };

    function getId(url) {
      return url;
    }
  }

  function loadScript(src, callback) {
    var script = window.document.createElement('script');

    script.async = true;
    script.src = src;

    var firstScriptTag = window.document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

    script.onload = script.onreadystatechange = function () {
      var rdyState = script.readyState;
      if (!rdyState || /complete|loaded/.test(rdyState)) {
        if (callback) {
          callback();
        }
        script.onload = null;
        script.onreadystatechange = null;
      }
    };
  }
})();
