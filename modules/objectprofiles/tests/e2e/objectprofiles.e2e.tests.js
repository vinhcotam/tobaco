'use strict';

describe('Objectprofiles E2E Tests:', function () {
  describe('Test Objectprofiles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/objectprofiles');
      expect(element.all(by.repeater('objectprofile in objectprofiles')).count()).toEqual(0);
    });
  });
});
