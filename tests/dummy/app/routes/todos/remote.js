import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  _findModelName: function() {
    return 'todo';
  },

  actions: {
    pageClicked: function(page) {
      this.set("controller.content.page",page);
    }
  }
});