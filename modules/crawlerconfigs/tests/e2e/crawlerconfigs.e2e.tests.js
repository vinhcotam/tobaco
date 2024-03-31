'use strict';

describe('Crawlerconfigs E2E Tests:', function () {
  describe('Test Crawlerconfigs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/crawlerconfigs');
      expect(element.all(by.repeater('crawlerconfig in crawlerconfigs')).count()).toEqual(0);
    });
  });
});
