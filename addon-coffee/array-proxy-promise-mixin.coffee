`import Ember from 'ember'`

ArrayProxyPromiseMixin = Ember.Mixin.create Ember.PromiseProxyMixin, 
  then: (f) ->
    promise = @get('promise')
    promise.then =>
      f(this)

`export default ArrayProxyPromiseMixin`