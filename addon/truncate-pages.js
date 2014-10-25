import Ember from 'ember';

export default Ember.Object.extend({
  numPagesToShowBefore: 5,
  numPagesToShowAfter: 5,
  currentPage: null,
  totalPages: null,

  isValidPage: function(page) {
    var totalPages = this.get('totalPages');

    return page > 0 && page <= totalPages;
  },

  pagesToShow: function() {
    var res = [];
    var before = this.get('numPagesToShowBefore');
    var after = this.get('numPagesToShowAfter');
    var currentPage = this.get('currentPage');
    var totalPages = this.get('totalPages');

    var possiblePage;

    for(var i=before;i>0;i--) {
      possiblePage = currentPage-i;
      if (this.isValidPage(possiblePage)) {
        res.push(possiblePage);
      }
    }

    res.push(currentPage);

    for(i=1;i<=after;i++) {
      possiblePage = currentPage+i;
      if (this.isValidPage(possiblePage)) {
        res.push(possiblePage);
      }
    }

    if (res.length > 0 && res[res.length-1] !== totalPages) {
      res.push(totalPages);
    }

    if (res.length > 0 && res[0] !== 1) {
      var rest = res;
      res = [1];
      res = res.concat(rest);
    }

    return res;

  }.property("numPagesToShowBefore","numPagesToShowAfter","currentPage","totalPages")
});