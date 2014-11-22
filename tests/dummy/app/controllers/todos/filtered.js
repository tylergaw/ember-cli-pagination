import Ember from 'ember';

export default Ember.ArrayController.extend({
  queryParams: ["page","perPage"],
  page: 1,

  filteredContent: function() {
    var all = this.get('content');
    var min = this.get('minNum');

    if (min) {
      return all.filter(function(todo) {
        return todo.get('id') >= parseInt(min);
      });
    }
    else {
      return all;
    }
  }.property("content.@each","minNum")
});