'use strict';

describe('Monitoringobjects E2E Tests:', function () {
  describe('Test Monitoringobjects page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/monitoringobjects');
      expect(element.all(by.repeater('monitoringobject in monitoringobjects')).count()).toEqual(0);
    });
  });
});
