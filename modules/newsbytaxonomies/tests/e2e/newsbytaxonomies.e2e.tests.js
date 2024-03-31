'use strict';

describe('Newsbytaxonomies E2E Tests:', function () {
  describe('Test Newsbytaxonomies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/newsbytaxonomies');
      expect(element.all(by.repeater('newsbytaxonomy in newsbytaxonomies')).count()).toEqual(0);
    });
  });
});
