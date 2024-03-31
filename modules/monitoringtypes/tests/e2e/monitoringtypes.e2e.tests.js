'use strict';

describe('Monitoringtypes E2E Tests:', function () {
  describe('Test Monitoringtypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/monitoringtypes');
      expect(element.all(by.repeater('monitoringtype in monitoringtypes')).count()).toEqual(0);
    });
  });
});
