'use strict';

describe('Contentidentifications E2E Tests:', function () {
  describe('Test Contentidentifications page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/contentidentifications');
      expect(element.all(by.repeater('contentidentification in contentidentifications')).count()).toEqual(0);
    });
  });
});
