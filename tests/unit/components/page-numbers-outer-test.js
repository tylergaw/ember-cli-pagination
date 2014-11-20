import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import PageNumbersInnerComponent from '../../../components/page-numbers-inner';

var makePagedArray = function(list) {
  return PagedArray.create({content: list, perPage: 2, page: 1});
};

moduleForComponent("page-numbers-outer", "PageNumbersOuterComponent", {
  needs: ["component:page-numbers-inner"]
});

var paramTest = function(name,ops,f) {
  test(name, function() {
    var subject = this.subject();

    Ember.run(function() {
      Object.keys(ops).forEach(function (key) { 
          var value = ops[key];
          subject.set(key,value);
      });
    });

    f.call(this,subject,ops);
  });
};

paramTest("smoke", {content: makePagedArray([1,2,3,4,5])}, function(outer,ops) {
  var inner = PageNumbersInnerComponent.create({content: ops.content});
  inner.set('targetObject',outer);
  inner.set('action','pageClicked');

  equal(inner.get('totalPages'),3);
  Ember.run(function() {
    inner.send('pageClicked',2);
  });

  equal(ops.content.get('page'),2);



});

// paramTest("pageClicked sends default event", {content: makePagedArray([1,2,3,4,5])}, function(s,ops) {
//   var actionCounter = 0;
//   var clickedPage = null;
//   var containingObject = {
//     doThing: function(n) {
//       actionCounter++;
//       clickedPage = n;
//     }
//   };

//   s.set('targetObject',containingObject);
//   s.set('action','doThing');

//   equal(s.get('totalPages'),3);
//   Ember.run(function() {
//     s.send('pageClicked',2);
//   });
//   equal(s.get('currentPage'),2);
//   equal(actionCounter,1);
//   equal(clickedPage,2);
// });

// setup an inner
// sets its action and parent to an outer
// set the same content on the inner and the outer
// trigger a pageClicked event on inner
// confirm page changes on content