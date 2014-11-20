import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    pageClicked: function(page) {
      this.get('content').set('page',page);
    }
  }
});