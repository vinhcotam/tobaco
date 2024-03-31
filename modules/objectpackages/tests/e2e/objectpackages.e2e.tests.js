'use strict';

describe('Objectpackages E2E Tests:', function () {
  describe('Test Objectpackages page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/objectpackages');
      expect(element.all(by.repeater('objectpackage in objectpackages')).count()).toEqual(0);
    });
  });
});
