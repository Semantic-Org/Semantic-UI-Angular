(function() {
  'use strict';

  angular
    .module('semantic.ui.elements.video.generator', [])
    .provider('smVideoGenerator', smVideoGenerator)
    .provider('smVideoYoutube', smVideoYoutube)
    .provider('smVideoVimeo', smVideoVimeo);

  function smVideoGenerator() {
    var generatorNames = ['smVideoYoutube', 'smVideoVimeo'];

    this.addGenerator = function(serviceName) {
      if (generatorNames.indexOf(serviceName) === -1) {
        generatorNames.push(serviceName);
      }
    };

    this.$get = ['$injector', function ($injector) {
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
        if (res.length > 1) {
          console.warn('Url matches multiple video sources: ' +
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
    if (!definition.embedUrl) {
      throw new Error('Embed url is missing from generator definition');
    }
    angular.extend(this, definition);
  }

  Generator.prototype.generateUrl = function(params) {
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
      '<iframe src="'+ this.embedUrl + id + '?=' + this.generateUrl(params) + '"' +
      ' width="100%" height="100%"' +
      ' frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
    return angular.element(html);
  };

  function smVideoYoutube() {
    var defaultParams = {
      modestbranding: 1,
      cc_load_policy: 1,
      autohide: 0
    };

    this.extendDefaultParams = function (params) {
      angular.extend(defaultParams, params);
    };

    this.$get = ['$window', '$q', function($window, $q) {
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
            var tag = $window.document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = $window.document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
        embedUrl: '//www.youtube.com/embed/',
        getIdFromUrl: getId,
        getPlayer: getPlayer
      };
    }];
  }

  function smVideoVimeo() {
    var defaultParams = {};

    this.extendDefaultParams = function (params) {
      angular.extend(defaultParams, params);
    };

    this.$get = ['$window', '$q', function($window, $q) {
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
            var script = $window.document.createElement('script');

            script.async = true;
            script.src = '//secure-a.vimeocdn.com/js/froogaloop2.min.js';

            var firstScriptTag = $window.document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

            script.onload = script.onreadystatechange = function () {
              var rdyState = script.readyState;
              if (!rdyState || /complete|loaded/.test(rdyState)) {
                resolve();
                script.onload = null;
                script.onreadystatechange = null;
              }
            };
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
        embedUrl: '//player.vimeo.com/video/',
        getIdFromUrl: getId,
        getPlayer: getPlayer
      };
    }];
  }
})();
