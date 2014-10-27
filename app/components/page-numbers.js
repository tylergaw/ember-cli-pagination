import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import TruncatePages from 'ember-cli-pagination/truncate-pages';

var PageItems = Ember.Object.extend({
  pageItemsAll: function() {
    var currentPage = Number(this.get("currentPage"));
    var totalPages = Number(this.get("totalPages"));
    Util.log("PageNumbers#pageItems, currentPage " + currentPage + ", totalPages " + totalPages);

    var res = [];
    for(var i=1; i<=totalPages; i++) {
      res.push({
        page: i,
        current: currentPage == i
      });
    }
    return res;
  }.property("currentPage", "totalPages"),

  pageItemsTruncated: function() {
    var currentPage = parseInt(this.get('currentPage'));
    var totalPages = parseInt(this.get('totalPages'));

    var before = this.get('numPagesToShowBefore');
    var after = this.get('numPagesToShowAfter');

    var t = TruncatePages.create({currentPage: currentPage, totalPages: totalPages, 
                                  numPagesToShowBefore: before, numPagesToShowAfter: after});
    var pages = t.get('pagesToShow');

    return pages.map(function(page) {
      return {
        page: page,
        current: (currentPage === page)
      }
    });
  }.property('currentPage','totalPages','numPagesToShowBefore','numPagesToShowAfter'),

  pageItems: function() {
    if (this.get('truncatePages')) {
      return this.get('pageItemsTruncated');
    }
    else {
      return this.get('pageItemsAll');
    }
  }.property('currentPage','totalPages','truncatePages','numPagesToShowBefore','numPagesToShowAfter')
});

export default Ember.Component.extend({
  currentPageBinding: "content.page",
  totalPagesBinding: "content.totalPages",

  truncatePages: true,
  numPagesToShowBefore: 5,
  numPagesToShowAfter: 5,

  pageItemsObj: function() {
    return PageItems.create({
      parent: this,
      currentPageBinding: "parent.currentPage",
      totalPagesBinding: "parent.totalPages",
      truncatePagesBinding: "parent.truncatePages",
      numPagesToShowBeforeBinding: "parent.numPagesToShowBefore",
      numPagesToShowAfterBinding: "parent.numPagesToShowAfter"
    });
  }.property(),

  pageItemsBinding: "pageItemsObj.pageItems",

  canStepForward: (function() {
    var page = Number(this.get("currentPage"));
    var totalPages = Number(this.get("totalPages"));
    return page < totalPages;
  }).property("currentPage", "totalPages"),

  canStepBackward: (function() {
    var page = Number(this.get("currentPage"));
    return page > 1;
  }).property("currentPage"),

  actions: {
    pageClicked: function(number) {
      Util.log("PageNumbers#pageClicked number " + number);
      this.set("currentPage", number);
    },
    incrementPage: function(num) {
      var currentPage = Number(this.get("currentPage")),
          totalPages = Number(this.get("totalPages"));

      if(currentPage === totalPages && num === 1) { return false; }
      if(currentPage <= 1 && num === -1) { return false; }
      this.incrementProperty('currentPage', num);
    }
  }
});
