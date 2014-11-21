import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import PageItems from 'ember-cli-pagination/lib/page-items';

export default Ember.Component.extend({
  currentPageBinding: Ember.Binding.oneWay('content.page'),
  totalPagesBinding: Ember.Binding.oneWay('content.totalPages'),

  watchInvalidPage: function() {
    var me = this;
    var c = this.get('content');
    if (c && c.on) {
      c.on('invalidPage', function(e) {
        me.sendAction('invalidPageAction',e);
      });
    }
  }.observes("content"),

  truncatePages: true,
  numPagesToShow: 10,

  pageItemsObj: function() {
    return PageItems.create({
      parent: this,
      currentPageBinding: "parent.currentPage",
      totalPagesBinding: "parent.totalPages",
      truncatePagesBinding: "parent.truncatePages",
      numPagesToShowBinding: "parent.numPagesToShow"
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
      this.sendAction('action',number);
    },
    incrementPage: function(num) {
      var currentPage = Number(this.get("currentPage")),
          totalPages = Number(this.get("totalPages"));

      if(currentPage === totalPages && num === 1) { return false; }
      if(currentPage <= 1 && num === -1) { return false; }

      var newPage = this.get('currentPage')+num;
      this.sendAction('action',newPage);
    }
  }
});
