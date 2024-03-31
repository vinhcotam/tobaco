'use strict';

describe('Socialcrawlerconfigs E2E Tests:', function () {
  describe('Test Socialcrawlerconfigs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/socialcrawlerconfigs');
      expect(element.all(by.repeater('socialcrawlerconfig in socialcrawlerconfigs')).count()).toEqual(0);
    });
  });
});
