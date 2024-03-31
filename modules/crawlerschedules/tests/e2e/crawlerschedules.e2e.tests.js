'use strict';

describe('Crawlerschedules E2E Tests:', function () {
  describe('Test Crawlerschedules page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/crawlerschedules');
      expect(element.all(by.repeater('crawlerschedule in crawlerschedules')).count()).toEqual(0);
    });
  });
});
