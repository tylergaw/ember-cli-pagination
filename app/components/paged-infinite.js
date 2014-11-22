import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

var YieldLocalMixin = Ember.Mixin.create({
  _yield: function(context, options) {
    var view = options.data.view;
    var parentView = this._parentView;
    var template = Ember.get(this, 'template');

    if (template) {
      Ember.assert("A Component must have a parent view in order to yield.", parentView);

      view.appendChild(Ember.View, {
        isVirtual: true,
        tagName: '',
        _contextView: parentView,
        template: template,
        context: Ember.get(view, 'context'),
        controller: Ember.get(view, 'controller'),
        templateData: { keywords: {} }
      });
    }
  }
});

export default Ember.Component.extend(YieldLocalMixin, {
  page: 1,
  perPage: 10,

  pagedContent: pagedArray('content', {infinite: "unpaged"}),

  watchPage: function() {
    console.log("page "+this.get('page'));
  }.observes("page"),

  actions: {
    // pageClicked: function(page) {
    //   this.set("pagedContent.page",page);
    //   this.sendAction('action',page);
    // }

    loadNext: function() {
      this.get('pagedContent').loadNextPage();
      this.sendAction('action');
    }
  }
});