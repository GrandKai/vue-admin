import * as types from './types'

export default {
    expandMenu: ({commit}) => {
        commit(types.EXPAND_MENU)
    },
    selectContCatalogId: ({commit}, contCatalogId) => {
        console.log('action被触发，参数', contCatalogId);
        commit(types.contCatalogId, contCatalogId);
    }
}