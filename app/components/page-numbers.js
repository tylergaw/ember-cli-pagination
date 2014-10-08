import Ember from 'ember';
import Util from 'ember-cli-pagination/util';

export default Ember.Component.extend({
  currentPage: null,
  totalPages: null,

  pageItems: function() {
    var currentPage, pageNumber, totalPages, _i, _results;

    var currentPage = Number(this.get("currentPage"));
    var totalPages = Number(this.get("totalPages"));
    Util.log("PageNumbers#pageItems, currentPage " + currentPage + ", totalPages " + totalPages);

    var res = [];
    for(var i=1; i<=totalPages; i++) {
      res.push({
        page: i,
        current: currentPage == 1
      });
    }
    return res;
  }.property("currentPage", "totalPages"),

  canStepForward: (function() {
    var page, totalPages;
    page = Number(this.get("currentPage"));
    totalPages = Number(this.get("totalPages"));
    return page < totalPages;
  }).property("currentPage", "totalPages"),
  canStepBackward: (function() {
    var page;
    page = Number(this.get("currentPage"));
    return page > 1;
  }).property("currentPage"),
  actions: {
    pageClicked: function(number) {
      Util.log("PageNumbers#pageClicked number " + number);
      return this.set("currentPage", number);
    },
    incrementPage: function(num) {
      return this.incrementProperty('currentPage', num);
    }
  }
});
