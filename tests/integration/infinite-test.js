import startApp from '../helpers/start-app';
import pretenderServer from '../helpers/pretender-server';
import Todo from '../../models/todo';
import Ember from 'ember';

var App = null;
var server = null;



var todosTestLocal = function(name, f, page) {
  test(name, function() {
    visit("/todos/infinite" + (page ? "?"+page : "")).then(f);
  });
};

var todosTestRemote = function(name, f, page) {
  test(name, function() {
    visit("/todos/infinite-remote" + (page ? "?"+page : "")).then(f);
  });
};

var runTests = function(todosTest) {
  todosTest("smoke", function() {
    hasTodos(10);
  });

  todosTest("next page", function() {
    hasTodos(10);

    click(".infinite .next a");
    andThen(function() {
      QUnit.stop();
      setTimeout(function() {
        equal(find('.infinite .todo').length,20);
        QUnit.start();
      },5);
    });
  });

  // todosTest("query param", function() {
  //   QUnit.stop();
  //   setTimeout(function() {
  //     hasTodos(3);
  //     QUnit.start();
  //   },50);
  // },4);
};

module('Integration - Infinite Pagination Local', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

runTests(todosTestLocal);

module('Integration - Infinite Pagination Remote', {
  setup: function() {
    App = startApp();
    server = pretenderServer();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});
runTests(todosTestRemote);

