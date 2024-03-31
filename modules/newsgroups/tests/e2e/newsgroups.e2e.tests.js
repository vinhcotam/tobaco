'use strict';

describe('Newsgroups E2E Tests:', function () {
  describe('Test Newsgroups page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/newsgroups');
      expect(element.all(by.repeater('newsgroup in newsgroups')).count()).toEqual(0);
    });
  });
});
