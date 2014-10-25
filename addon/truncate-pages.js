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

    return res;

  }.property("numPagesToShowBefore","numPagesToShowAfter","currentPage","totalPages")
});