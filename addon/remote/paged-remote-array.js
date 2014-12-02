import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import LockToRange from 'ember-cli-pagination/watch/lock-to-range';
import Mapping from './mapping';
import PageMixin from '../page-mixin';

function setProperties(obj,ops) {
  for (var k in ops) {
    obj.set(k,ops[k]);
  }
}

var ArrayProxyPromiseMixin = Ember.Mixin.create(Ember.PromiseProxyMixin, {
  addToPromiseList: function(p) {
    var a = this.get('promiseList') || [];
    a.push(p);
    this.set('promiseList',a);
  },



  then: function(success,failure) {
    var promise = this.get('promise');
    var me = this;
    //this.addToPromiseList([success,failure]);

    promise.then(function() {
      //console.log('in then');
      success(me);
    }, failure);
  },

  redoPromiseList: function() {
    var a = this.get('promiseList') || [];
    this.set('promiseList',[]);

    for (var i=0;i<a.length;i++) {
      var p = a[i];
      this.then(p[0],p[1]);
    }
  }.observes('promdise')
});

function tap(proxy, promise) {
  setProperties(proxy, {
    isFulfilled: false,
    isRejected: false
  });

  return promise.then(function(value) {
    setProperties(proxy, {
      content: value,
      isFulfilled: true
    });
    return value;
  }, function(reason) {
    setProperties(proxy, {
      reason: reason,
      isRejected: true
    });
    throw reason;
  }, "Ember: PromiseProxy");
}

export default Ember.ArrayProxy.extend(PageMixin, Ember.Evented, ArrayProxyPromiseMixin, {
  page: 1,
  paramMapping: function() {
    return {};
  }.property(''),

  promisfe: function() {
    return this.fetchContent();
  }.property(),

  init: function() {
    var initCallback = this.get('initCallback');
    if (initCallback) {
      initCallback(this);
    }

    var me = this;

    try {
      this.get('promise');
    }
    catch (e) {
      me.set('promise', me.fetchContent());
    }
    
    
    // Ember.run.later(function() {
    //   me.set('promise', me.fetchContent());
    // },0);
    
  },

  promfise: Ember.computed(function(key, promise) {
    if (arguments.length === 2) {
      tap(this, promise);
      return promise;
    } else {
      return this.fetchContent();
    }
  }),

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

  addQueryParamMapping: function(key,mappedKey,mappingFunc) {
    return this.addParamMapping(key,mappedKey,mappingFunc);
  },

  addMetaResponseMapping: function(key,mappedKey,mappingFunc) {
    return this.addParamMapping(key,mappedKey,mappingFunc);
  },

  paramsForBackend: function() {
    var paramsObj = Mapping.QueryParamsForBackend.create({page: this.getPage(), 
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

    // var wrapSuccess;
    // var wrapFailure;

    // var wrapPromise = new Ember.RSVP.Promise(function(success,failure) {
    //   wrapSuccess = success;
    //   wrapFailure = failure;
    // });

    res.then(function(rows) {
      var metaObj = Mapping.ChangeMeta.create({paramMapping: me.get('paramMapping'),
                                               meta: rows.meta,
                                               page: me.getPage(),
                                               perPage: me.getPerPage()});

      //wrapSuccess(me);
      return me.set("meta", metaObj.make());
      
    }, function(error) {
      //wrapFailure(me);
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