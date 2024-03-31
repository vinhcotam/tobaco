'use strict';

describe('Languagevariables E2E Tests:', function () {
  describe('Test Languagevariables page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/languagevariables');
      expect(element.all(by.repeater('languagevariable in languagevariables')).count()).toEqual(0);
    });
  });
});
