'use strict';

describe('Crawlerdrivers E2E Tests:', function () {
  describe('Test Crawlerdrivers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/crawlerdrivers');
      expect(element.all(by.repeater('crawlerdriver in crawlerdrivers')).count()).toEqual(0);
    });
  });
});
