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

      function generateFromUrl(url, params) {
        var html, matchingGenerators = [];

        generators.forEach(function(gen) {
          var id = angular.isFunction(gen.getIdFromUrl) && gen.getIdFromUrl(url);
          if (id) {
            html = gen.generate(id, params);
            matchingGenerators.push(gen);
          }
        });

        if (!html) { throw new Error('Url does not match with any video source'); }
        if (matchingGenerators.length > 1) {
          console.warn('Url matches multiple video sources: ' +
            matchingGenerators.map(function(gen) { return gen.source; }) +
            '. Used source: ' + matchingGenerators[matchingGenerators.length - 1].source);
        }
        return html;
      }

      return {
        generateFromUrl: generateFromUrl,
        get: get
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
    return html;
  };

  function smVideoYoutube() {
    var defaultParams = {
      modestbranding: 1,
      cc_load_policy: 1,
      autohide: 0
    };

    this.extendDefaultParams = function (value) {
      angular.extend(defaultParams, value);
    };

    this.$get = function() {
      var regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

      function getId(url) {
        var matches = url.match(regExp);
        return matches && matches[1];
      }

      return {
        defaultParams: defaultParams,
        source: 'youtube',
        embedUrl: '//www.youtube.com/embed/',
        getIdFromUrl: getId
      };
    };
  }

  function smVideoVimeo() {
    var defaultParams = {};

    this.extendDefaultParams = function (value) {
      angular.extend(defaultParams, value);
    };

    this.$get = function() {
      var regExp = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;

      function getId(url) {
        var matches = url.match(regExp);
        return matches && matches[3];
      }

      return {
        defaultParams: defaultParams,
        source: 'vimeo',
        embedUrl: '//player.vimeo.com/video/',
        getIdFromUrl: getId
      };
    };
  }
})();
