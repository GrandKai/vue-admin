import * as types from './types'

export default {
    expandMenu: ({commit}) => {
        commit(types.EXPAND_MENU)
    },
    selectContCatalogId: ({commit}, contCatalogId) => {
        commit(types.contCatalogId, contCatalogId);
    },
    changeMenusByPlatId({commit}, menus) {
        console.error('changeMenusByPlatId', menus)
        commit(types.changeMenusByPlatId, menus)
    },
    changePlat({commit}, platId) {
        commit(types.changePlat, platId)
    },
    logout({commit}) {
        commit(types.changePlat, '')
        commit(types.changeMenusByPlatId, [])
    }
}
