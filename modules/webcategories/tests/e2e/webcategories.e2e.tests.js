'use strict';

describe('Webcategories E2E Tests:', function () {
  describe('Test Webcategories page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/webcategories');
      expect(element.all(by.repeater('webcategory in webcategories')).count()).toEqual(0);
    });
  });
});
