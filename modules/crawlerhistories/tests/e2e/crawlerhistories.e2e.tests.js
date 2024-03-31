'use strict';

describe('Crawlerhistories E2E Tests:', function () {
  describe('Test Crawlerhistories page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/crawlerhistories');
      expect(element.all(by.repeater('crawlerhistory in crawlerhistories')).count()).toEqual(0);
    });
  });
});
