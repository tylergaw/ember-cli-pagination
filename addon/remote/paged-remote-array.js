import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import LockToRange from 'ember-cli-pagination/watch/lock-to-range';

var ArrayProxyPromiseMixin = Ember.Mixin.create(Ember.PromiseProxyMixin, {
  then: function(success,failure) {
    var promise = this.get('promise');
    var me = this;

    promise.then(function() {
      success(me);
    }, failure);
  }
});

var QueryParamsForBackend = Ember.Object.extend({
  defaultKeyFor: function(key) {
    if (key === 'perPage') {
      return 'per_page';
    }
    return null;
  },

  paramKeyFor: function(key) {
    return this.getSuppliedParamMapping(key) || this.defaultKeyFor(key) || key;
  },

  getSuppliedParamMapping: function(key) {
    var h = this.get('paramMapping') || {};
    return h[key];
  },

  accumParams: function(key,accum) {
    var val = this.get(key);
    var mappedKey = this.paramKeyFor(key);

    if (Array.isArray(mappedKey)) {
      this.accumParamsComplex(key,mappedKey,accum);
    }
    else {
      accum[mappedKey] = val;
    }
  },

  accumParamsComplex: function(key,mapArr,accum) {
    var mappedKey = mapArr[0];
    var mapFunc = mapArr[1];

    var val = mapFunc({page: this.get('page'), perPage: this.get('perPage')});
    accum[mappedKey] = val;
  },

  make: function() {
    var res = {};

    this.accumParams('page',res);
    this.accumParams('perPage',res);

    return res;
  }
});

var PageMixin = Ember.Mixin.create({
  getPage: function() {
    return parseInt(this.get('page') || 1);
  },

  getPerPage: function() {
    return parseInt(this.get('perPage'));
  }
});

var ChangeMeta = Ember.Object.extend({
  getSuppliedParamMapping: function(targetVal) {
    var h = this.get('paramMapping') || {};
    // return Util.getHashKeyForValue(h,function(v) {
    //   return v === val || (Array.isArray(v) && v[0] === val);
    // });

    for (var key in h) {
      var val = h[key];
      if (targetVal === val) {
        return key;
      }
      else if (Array.isArray(val) && val[0] === targetVal) {
        return [key,val[1]];
      }
    }

    return null;
  },

  finalKeyFor: function(key) {
    return this.getSuppliedParamMapping(key) || key;
  },

  makeSingleComplex: function(key,mapArr,rawVal,accum) {
    var mappedKey = mapArr[0];
    var mapFunc = mapArr[1];

    var ops = {rawVal: rawVal, page: this.get('page'), perPage: this.get('perPage')};
    var mappedVal = mapFunc(ops);
    accum[mappedKey] = mappedVal;
  },

  make: function() {
    var res = {};
    var meta = this.get('meta');

    for (var key in meta) {
      var mappedKey = this.finalKeyFor(key);
      var val = meta[key];

      if (Array.isArray(mappedKey)) {
        this.makeSingleComplex(key,mappedKey,val,res);
      }
      else {
        res[mappedKey] = val;
      }
    }

    return res;
  }
});

export default Ember.ArrayProxy.extend(PageMixin, Ember.Evented, ArrayProxyPromiseMixin, {
  page: 1,
  paramMapping: function() {
    return {};
  }.property(''),

  init: function() {
    this.set('promise', this.fetchContent());
  },

  addParamMapping: function(key,mappedKey,mappingFunc) {
    var paramMapping = this.get('paramMapping') || {};
    if (mappingFunc) {
      paramMapping[key] = [mappedKey,mappingFunc];
    }
    else {
      paramMapping[key] = mappedKey;
    }
    this.set('paramMapping',paramMapping);
    this.incrementProperty('paramsForBackendCounter');
    this.pageChanged();
  },

  paramsForBackend: function() {
    var paramsObj = QueryParamsForBackend.create({page: this.getPage(), 
                                                  perPage: this.getPerPage(), 
                                                  paramMapping: this.get('paramMapping')});
    var ops = paramsObj.make();

    // take the otherParams hash and add the values at the same level as page/perPage
    ops = Util.mergeHashes(ops,this.get('otherParams')||{});

    return ops;
  }.property('page','perPage','paramMapping','paramsForBackendCounter'),

  rawFindFromStore: function() {
    var store = this.get('store');
    var modelName = this.get('modelName');

    var ops = this.get('paramsForBackend');
    var res = store.find(modelName, ops);

    return res;
  },

  fetchContent: function() {
    var res = this.rawFindFromStore();
    this.incrementProperty("numRemoteCalls");
    var me = this;

    res.then(function(rows) {
      var metaObj = ChangeMeta.create({paramMapping: me.get('paramMapping'),
                                       meta: rows.meta,
                                       page: me.getPage(),
                                       perPage: me.getPerPage()});

      return me.set("meta", metaObj.make());
    }, function(error) {
      Util.log("PagedRemoteArray#fetchContent error " + error);
    });

    return res;
  },  

  totalPagesBinding: "meta.total_pages",

  pageChanged: function() {
    this.set("promise", this.fetchContent());
  }.observes("page", "perPage"),

  lockToRange: function() {
    LockToRange.watch(this);
  },

  watchPage: function() {
    var page = this.get('page');
    var totalPages = this.get('totalPages');
    if (parseInt(totalPages) <= 0) {
      return;
    }

    this.trigger('pageChanged',page);

    if (page < 1 || page > totalPages) {
      this.trigger('invalidPage',{page: page, totalPages: totalPages, array: this});
    }
  }.observes('page','totalPages')
});