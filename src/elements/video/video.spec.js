describe('Semantic-UI: Elements - smVideo', function() {
  'use strict';

  var $rootScope, $compile, smVideoGenerator, element;

  beforeEach(function() {
    module('semantic.ui.elements.video', function(smVideoGeneratorProvider, smVideoVimeoProvider) {
      smVideoGeneratorProvider.addGenerator('mockGenerator1');
      smVideoGeneratorProvider.addGenerator('mockGenerator2');
      smVideoVimeoProvider.extendDefaultParams({
        loop: 1
      });
    });

    module(function($provide) {
      $provide.value('mockGenerator1', {
        source: 'mock1',
        embedUrl: '//www.mock.com/embed/',
        getIdFromUrl: function(url) { return url === 'mock.com' ? 'good' : null; }
      });
      $provide.value('mockGenerator2', {
        source: 'mock2',
        embedUrl: '//www.mock.com/embed/',
        getIdFromUrl: function(url) { return url === 'mock.com' ? 'good' : null; }
      });
    });

    inject(function(_$rootScope_, _$compile_, _smVideoGenerator_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      smVideoGenerator = _smVideoGenerator_;

      element = $compile('<sm-video source="youtube" data-id="random_id"></sm-video>')($rootScope);
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
    element = $compile('<sm-video url="https://www.youtube.com/watch?v=OwHc05fu-YY"></sm-video>')($rootScope);
    expect(getIframeSrc()).toContain('youtube.com');
    expect(getIframeSrc()).toContain('OwHc05fu-YY');
  });

  it('handles vimeo video with url', function() {
    element = $compile('<sm-video url="https://vimeo.com/37328349"></sm-video>')($rootScope);
    expect(getIframeSrc()).toContain('vimeo.com');
    expect(getIframeSrc()).toContain('37328349');
  });

  describe('placeholder', function() {
    beforeEach(function() {
      element = $compile('<sm-video source="youtube" data-id="random_id" placeholder="cat.jpg" pr-autoplay="0"></sm-video>')($rootScope);
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
      element = $compile('<sm-video source="vimeo" data-id="37328349"></sm-video>')($rootScope);
      spyOn(console, 'warn');
    });

    it('extends default params', function() {
      expect(getIframeSrc()).toContain('loop=1');
    });

    it('overrides default params', function() {
      $rootScope.options = {
        loop: 2
      };
      element = $compile('<sm-video source="vimeo" data-id="37328349" options="options"></sm-video>')($rootScope);
      $rootScope.$digest();
      expect(getIframeSrc()).toContain('loop=2');
    });

    it('overrides scope options', function() {
      $rootScope.options = {
        loop: 2
      };
      element = $compile('<sm-video source="vimeo" data-id="37328349" options="options" pr-loop="3"></sm-video>')($rootScope);
      $rootScope.$digest();
      expect(getIframeSrc()).toContain('loop=3');
    });

    it('should add custom generators', function() {
      expect(smVideoGenerator.get('mock1')).toBeDefined();
      expect(smVideoGenerator.get('mock2')).toBeDefined();
    });

    it('shows warnings when url matches multiple sources', function() {
      element = $compile('<sm-video url="mock.com"></sm-video>')($rootScope);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  it('throws error when missing video', function() {
    var error = new Error('No source or url for video.');
    expect(function() {
      element = $compile('<sm-video></sm-video>')($rootScope);
    }).toThrow(error);
    expect(function() {
      element = $compile('<sm-video source="youtube"></sm-video>')($rootScope);
    }).toThrow(error);
    expect(function() {
      element = $compile('<sm-video data-id="some_id"></sm-video>')($rootScope);
    }).toThrow(error);
  });

  it('throw error when video url is invalid', function() {
    var error = new Error('Url does not match with any video source');
    expect(function() {
      element = $compile('<sm-video url="mock.com/foo"></sm-video>')($rootScope);
    }).toThrow(error);
  });

});
