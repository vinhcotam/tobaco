'use strict';

describe('Taxonomies E2E Tests:', function () {
  describe('Test Taxonomies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/taxonomies');
      expect(element.all(by.repeater('taxonomy in taxonomies')).count()).toEqual(0);
    });
  });
});
