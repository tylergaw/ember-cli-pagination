import Ember from 'ember';
import { test } from 'ember-qunit';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
import Util from 'ember-cli-pagination/util';
import toArray from '../../helpers/to-array';
import equalArray from '../../helpers/equal-array';


module("Remote Route Mixin");

var Promise = Ember.RSVP.Promise;

test("smoke", function() {
  equal(2,2);
});

var MockStore = Ember.Object.extend({
  findArgs: [],

  find: function(modelName,params) {
    var me = this;
    return new Promise(function(success,failure) {
      me.get("findArgs").pushObject({modelName: modelName, params: params});
      success([]);
    });
  }
});

test("thing", function() {
  var store = MockStore.create();

  var Something = Ember.Object.extend(RouteMixin, {});
  var something = Something.create({store: store});

  something.findPaged("todo",{name: "Adam"});
  var findArgs = store.get('findArgs');

  console.debug(findArgs);
  equal(findArgs.length,1);
  equal(findArgs[0].modelName,"todo");
  equal(findArgs[0].params.name,"Adam");


});

test("hash property explore", function() {
  var keysOtherThan = function(params,excludeKeys) {
    var res = [];
    for (var key in params) {
      if (!excludeKeys.contains(key)) {
        res.push(key);
      }
    }
    return res;
  };

  var paramsOtherThan = function(params,excludeKeys) {
    var res = {};
    var keys = keysOtherThan(params,excludeKeys);
    for(var i=0;i<keys.length;i++) {
      var key = keys[i];
      var val = params[key];
      res[key] = val;
    }
    return res;
  };

  var params = {page: 1, name: "Adam"};
  var keys = keysOtherThan(params,["page","perPage"]);
  equalArray(keys,["name"]);

  var other = paramsOtherThan(params,["page","perPage"]);
  deepEqual(other,{name: "Adam"});
});