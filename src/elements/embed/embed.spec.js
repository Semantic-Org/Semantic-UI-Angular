describe('Semantic-UI: Elements - smEmbed', function() {
  'use strict';

  var $rootScope, $compile, $log, smEmbedGenerator, element;

  beforeEach(function() {
    module('semantic.ui.elements.embed', function(smEmbedGeneratorProvider, smEmbedVimeoProvider) {
      smEmbedGeneratorProvider.addGenerator('mockGenerator1');
      smEmbedGeneratorProvider.addGenerator('mockGenerator2');
      smEmbedVimeoProvider.extendDefaultParams({
        loop: 1
      });
    });

    module(function($provide) {
      $provide.value('mockGenerator1', {
        source: 'mock1',
        url: '//www.mock.com/embed/{id}',
        getIdFromUrl: function(url) { return url === 'mock.com' ? 'good' : null; }
      });
      $provide.value('mockGenerator2', {
        source: 'mock2',
        url: '//www.mock.com/embed/{id}',
        getIdFromUrl: function(url) { return url === 'mock.com' ? 'good' : null; }
      });
    });

    inject(function(_$rootScope_, _$compile_, _smEmbedGenerator_, _$log_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $log = _$log_;
      smEmbedGenerator = _smEmbedGenerator_;

      element = $compile('<sm-embed source="youtube" data-id="random_id"></sm-embed>')($rootScope);
    });
  });

  function getIframeSrc() {
    return element.find('iframe').attr('src');
  }

  function getImgSrc() {
    return element.find('img').attr('src');
  }

  function triggerKeyDown(keyCode) {
    var e = $.Event('keydown');
    e.which = keyCode;
    element.trigger(e);
  }

  it('contains id and default params', function() {
    expect(getIframeSrc()).toContain('modestbranding=1');
    expect(getIframeSrc()).toContain('random_id');
  });

  it('handles youtube video with url', function() {
    element = $compile('<sm-embed url="https://www.youtube.com/watch?v=OwHc05fu-YY"></sm-embed>')($rootScope);
    expect(getIframeSrc()).toContain('youtube.com');
    expect(getIframeSrc()).toContain('OwHc05fu-YY');
  });

  it('handles vimeo video with url', function() {
    element = $compile('<sm-embed url="https://vimeo.com/37328349"></sm-embed>')($rootScope);
    expect(getIframeSrc()).toContain('vimeo.com');
    expect(getIframeSrc()).toContain('37328349');
  });


  it('handles embed with any url', function() {
    element = $compile('<sm-embed url="mock.com/foo"></sm-embed>')($rootScope);
    expect(getIframeSrc()).toContain('mock.com/foo');
  });

  describe('placeholder', function() {
    beforeEach(function() {
      element = $compile('<sm-embed source="youtube" data-id="random_id" placeholder="cat.jpg" pr-autoplay="0"></sm-embed>')($rootScope);
    });

    it('contains placeholder image', function() {
      expect(getImgSrc()).toBe('cat.jpg');
    });

    it('should not load iframe', function() {
      expect(element.find('iframe').length).toBe(0);
    });

    it('handles click event', function() {
      element.click();
      expect(element.find('iframe').length).toBe(1);
    });

    it('support space key', function() {
      triggerKeyDown(32);
      expect(element.find('iframe').length).toBe(1);
    });

    it('should always autoplay', function() {
      element.click();
      expect(getIframeSrc()).toContain('autoplay=1');
    });

  });

  describe('customization', function() {
    beforeEach(function(){
      element = $compile('<sm-embed source="vimeo" data-id="37328349"></sm-embed>')($rootScope);
      spyOn($log, 'warn');
    });

    it('extends default params', function() {
      expect(getIframeSrc()).toContain('loop=1');
    });

    it('overrides default params', function() {
      $rootScope.options = {
        loop: 2
      };
      element = $compile('<sm-embed source="vimeo" data-id="37328349" options="options"></sm-embed>')($rootScope);
      $rootScope.$digest();
      expect(getIframeSrc()).toContain('loop=2');
    });

    it('overrides scope options', function() {
      $rootScope.options = {
        loop: 2
      };
      element = $compile('<sm-embed source="vimeo" data-id="37328349" options="options" pr-loop="3"></sm-embed>')($rootScope);
      $rootScope.$digest();
      expect(getIframeSrc()).toContain('loop=3');
    });

    it('should add custom generators', function() {
      expect(smEmbedGenerator.get('mock1')).toBeDefined();
      expect(smEmbedGenerator.get('mock2')).toBeDefined();
    });

    it('shows warnings when url matches multiple sources', function() {
      element = $compile('<sm-embed url="mock.com"></sm-embed>')($rootScope);
      expect($log.warn).toHaveBeenCalled();
    });
  });

  it('throws error when missing video', function() {
    var error = new Error('No source or url for video.');
    expect(function() {
      element = $compile('<sm-embed></sm-embed>')($rootScope);
    }).toThrow(error);
    expect(function() {
      element = $compile('<sm-embed source="youtube"></sm-embed>')($rootScope);
    }).toThrow(error);
    expect(function() {
      element = $compile('<sm-embed data-id="some_id"></sm-embed>')($rootScope);
    }).toThrow(error);
  });

});
