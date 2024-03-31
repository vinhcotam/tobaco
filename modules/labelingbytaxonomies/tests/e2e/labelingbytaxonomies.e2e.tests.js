'use strict';

describe('Labelingbytaxonomies E2E Tests:', function () {
  describe('Test Labelingbytaxonomies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/labelingbytaxonomies');
      expect(element.all(by.repeater('labelingbytaxonomy in labelingbytaxonomies')).count()).toEqual(0);
    });
  });
});
