'use strict';

describe('Sentiments E2E Tests:', function () {
  describe('Test Sentiments page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sentiments');
      expect(element.all(by.repeater('sentiment in sentiments')).count()).toEqual(0);
    });
  });
});
