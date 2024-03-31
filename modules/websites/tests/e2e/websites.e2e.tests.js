'use strict';

describe('Websites E2E Tests:', function () {
  describe('Test Websites page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/websites');
      expect(element.all(by.repeater('website in websites')).count()).toEqual(0);
    });
  });
});
