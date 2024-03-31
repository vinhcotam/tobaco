'use strict';

describe('Activitylogs E2E Tests:', function () {
  describe('Test Activitylogs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/activitylogs');
      expect(element.all(by.repeater('activitylog in activitylogs')).count()).toEqual(0);
    });
  });
});
