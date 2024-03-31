'use strict';

describe('Keywords E2E Tests:', function () {
  describe('Test Keywords page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/keywords');
      expect(element.all(by.repeater('keyword in keywords')).count()).toEqual(0);
    });
  });
});
