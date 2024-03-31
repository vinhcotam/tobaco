'use strict';

describe('Statistics E2E Tests:', function () {
  describe('Test Statistics page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/statistics');
      expect(element.all(by.repeater('statistic in statistics')).count()).toEqual(0);
    });
  });
});
