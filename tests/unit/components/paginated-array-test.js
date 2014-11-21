import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import PagedArray from 'ember-cli-pagination/local/paged-array';
import PageNumbersInnerComponent from '../../../components/page-numbers-inner';

var makePagedArray = function(list) {
  return PagedArray.create({content: list, perPage: 2, page: 1});
};

moduleForComponent("paginated-array", "PaginatedArrayComponent", {
  needs: ["component:page-numbers-inner"]
});

var paramTest = function(name,ops,f) {
  test(name, function() {
    ops.perPage = 2;
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

var makeContainingObject = function(subject) {
  var containingObject = {
    doThing: function(n) {
      this.actionCounter++;
      this.clickedPage = n;
    },
    actionCounter: 0,
    clickedPage: null
  };

  subject.set('targetObject',containingObject);
  subject.set('action','doThing');

  return containingObject;
};

paramTest("pagedContent is created", {content: [1,2,3,4,5]}, function(s,ops) {
  equal(s.get('pagedContent.page'),1);
  equal(s.get('pagedContent.totalPages'),3);
});

paramTest("changing ", {content: [1,2,3,4,5]}, function(s,ops) {
  equal(s.get('pagedContent.page'),1);
  equal(s.get('pagedContent.totalPages'),3);
});

var t = Ember.Handlebars.compile('<div class="paged-row">{{this}}</div>');
paramTest("pagedContent renders 3 rows", {content: [1,2,3,4,5], template: t}, function(s,ops) {
  equal(this.$().find(".paged-row").length,2);
});

paramTest("pagedContent renders rows correctly", {content: [1,2,3,4,5], template: t}, function(s,ops) {
  equal(this.$().find(".paged-row:eq(0)").text(),"1");
});

// paramTest("has page-numbers", {content: [1,2,3,4,5], template: t}, function(s,ops) {
//   equal(this.$().find(".pagination").length,1);
// });


// paramTest("page prop on content is set", {content: [1,2,3,4,5]}, function(s,ops) {
//   equal(s.get('page'),1);
// });

// setup an inner
// sets its action and parent to an outer
// set the same content on the inner and the outer
// trigger a pageClicked event on inner
// confirm page changes on content