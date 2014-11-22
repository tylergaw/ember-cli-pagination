import Ember from 'ember';

export default Ember.ArrayController.extend({
  queryParams: ["page","perPage"],
  page: 1,

  showRow: true
});