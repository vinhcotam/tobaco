'use strict';

describe('Keyinformants E2E Tests:', function () {
  describe('Test Keyinformants page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/keyinformants');
      expect(element.all(by.repeater('keyinformant in keyinformants')).count()).toEqual(0);
    });
  });
});
