import Vue from 'vue'
import Vuex from 'vuex'

// 使用 vuex
Vue.use(Vuex);

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

// 创建 vuex 实例
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});

// 导出 store
export default store;