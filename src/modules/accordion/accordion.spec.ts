///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
///<reference path="../../../typings/angularjs/angular-mocks.d.ts"/>

import { smAccordionModule } from './accordion.module';

describe('Semantic-UI: Components - smAccordion', function () {
    'use strict';

    let $scope, $compile, element, settings;

    beforeEach(angular.mock.module(smAccordionModule.name));

    beforeEach(inject(function ($rootScope, $injector, smAccordionSettings) {
        $scope = $rootScope.$new();
        $compile = $injector.get('$compile');
        element = $compile(template)($scope);
        settings = smAccordionModule;
        $scope.$digest();
    }));

    it('expected elements length', function () {
        expect(element.find('.title').length).toBe(8);
        expect(element.find('.content').length).toBe(8);
    });

    it('no one active by default', function () {
        expect(element.find('.active').length).toBe(0);
    });

    it('all title have icon', function () {
        expect(element.find('.title:first').children('i.icon').length).toBe(1);
    });


    it('open first group', function () {
        var firstTitle = element.find('.title:first');
        firstTitle.click();
        $scope.$digest();

        expect(firstTitle.hasClass('active')).toBe(true);
        expect(firstTitle.next().hasClass('active')).toBe(true);

        var activeTitle = element.find('.title.active');
        expect(activeTitle.length > 0).toBe(true);
        activeTitle.click();
        $scope.$digest();
        expect(element.find('.title.active').length).toBe(0);
        expect(element.find('.content.active').length).toBe(0);

    });

    it('exclusive setting', function () {
        var firstTitle = element.find('.title:first');
        var lastTitle = element.find('.title:last');
        firstTitle.click();
        $scope.$digest();

        expect(firstTitle.hasClass('active')).toBe(true);
        expect(firstTitle.next().hasClass('active')).toBe(true);

        lastTitle.click();
        $scope.$digest();
        
        expect(firstTitle.hasClass('active')).toBe(false);
        expect(firstTitle.next().hasClass('active')).toBe(false);
        expect(lastTitle.hasClass('active')).toBe(true);
        expect(lastTitle.next().hasClass('active')).toBe(true);

    });

});

describe('Semantic-UI: Components - smAccordion - Custom Settings', function () {
    'use strict';

    let $scope, $compile, element;
    let settings = {
        exclusive: false
    }

    beforeEach(angular.mock.module(smAccordionModule.name));

    beforeEach(inject(function ($rootScope, $injector, smAccordionSettings) {
        $scope = $rootScope.$new();
        $compile = $injector.get('$compile');
        element = $compile(template)($scope);
        angular.extend(smAccordionSettings, settings);
        $scope.$digest();
    }));

    

    it('exclusive setting is false', function () {
        var firstTitle = element.find('.title:first');
        var lastTitle = element.find('.title:last');
        firstTitle.click();
        $scope.$digest();

        expect(firstTitle.hasClass('active')).toBe(true);
        expect(firstTitle.next().hasClass('active')).toBe(true);

        lastTitle.click();
        $scope.$digest();
        
        expect(firstTitle.hasClass('active')).toBe(true);
        expect(firstTitle.next().hasClass('active')).toBe(true);
        expect(lastTitle.hasClass('active')).toBe(true);
        expect(lastTitle.next().hasClass('active')).toBe(true);

    });

});


var template = `
    <sm-accordion>
        <sm-accordion-title>
            Level 1
        </sm-accordion-title>
        <sm-accordion-content>
            <p>Welcome to level 1</p>

            <sm-accordion>
                <sm-accordion-title>
                    Level 1A
                </sm-accordion-title>

                <sm-accordion-content>
                    Level 1A Contents


                    <sm-accordion>
                        <sm-accordion-title>
                            Level 1A-A
                        </sm-accordion-title>
                        <sm-accordion-content>
                            Level 1A-A Contents
                        </sm-accordion-content>

                        <sm-accordion-title>
                            Level 1A-B
                        </sm-accordion-title>
                        <sm-accordion-content>
                            Level 1A-B Contents
                        </sm-accordion-content>
                    </sm-accordion>
                </sm-accordion-content>


                <sm-accordion-title>
                    Level 1B
                </sm-accordion-title>
                <sm-accordion-content>
                    Level 1B Contents
                </sm-accordion-content>

                <sm-accordion-title>
                    Level 1C
                </sm-accordion-title>
                <sm-accordion-content>
                    Level 1C Contents
                </sm-accordion-content>
            </sm-accordion>

        </sm-accordion-content>

        <sm-accordion-title>
            Level 2
        </sm-accordion-title>
        <sm-accordion-content>
            <p>Welcome to level 2</p>
        </sm-accordion-content>

        <sm-accordion-title>
            Level 3
        </sm-accordion-title>
        <sm-accordion-content>
            <p>Welcome to level 3</p>
        </sm-accordion-content>
    </sm-accordion>`;