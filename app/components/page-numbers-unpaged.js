import Ember from 'ember';
import PagedLocalArray from 'ember-cli-pagination/local/paged-array';

export default Ember.Component.extend({
  perPage: 10,
  page: 1,

  pagedContent: function() {
    return PagedLocalArray.create({content: this.get('content'), perPage: this.get('perPage'), pageBinding: "page"});
  }.property("content.@each"),

  actions: {
    pageClicked: function(page) {
      this.get('pagedContent').set('page',page);
      this.sendAction('action',page);
    }
  }
});