import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Todo from '../../models/todo';
import Ember from 'ember';

var App = null;
var server = null;

module('Integration - Filtered', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});



var todosTest = function(name, f, page) {
  test(name, function() {
    visit("/todos/filtered").then(f);
  });
};

todosTest("smoke", function() {
  hasTodos(10);
});

todosTest("set min", function() {
  fillIn(".filter-min input","28");
  andThen(function() {
    hasTodos(6);
  });
});

todosTest("set min - check pages", function() {
  fillIn(".filter-min input","11");
  andThen(function() {
    hasTodos(10);
    hasPages(3);
  });
});