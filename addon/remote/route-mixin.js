import Ember from 'ember';
import PagedRemoteArray from './paged-remote-array';

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

export default Ember.Mixin.create({
  perPage: 10,
  startingPage: 1,

  findPaged: function(name, params) {
    var mainOps = {
      page: params.page || this.get('startingPage'),
      perPage: params.perPage || this.get('perPage'),
      modelName: name,
      store: this.store
    };

    var otherOps = paramsOtherThan(params,["page","perPage"]);
    mainOps.otherParams = otherOps;

    return PagedRemoteArray.create(mainOps);
  }
});
