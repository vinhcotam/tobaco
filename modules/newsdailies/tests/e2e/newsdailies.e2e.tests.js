'use strict';

describe('Newsdailies E2E Tests:', function () {
  describe('Test Newsdailies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/newsdailies');
      expect(element.all(by.repeater('newsdaily in newsdailies')).count()).toEqual(0);
    });
  });
});
