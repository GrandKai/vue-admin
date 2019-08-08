import * as types from './types'

export default {
    expandMenu: ({commit}) => {
        commit(types.EXPAND_MENU)
    },
    selectContCatalogId: ({commit}, contCatalogId) => {
        console.log('action被触发，参数', contCatalogId);
        commit(types.contCatalogId, contCatalogId);
    },
    changeMenusByPlatId({commit}, menus) {
        console.log('根据平台id修改菜单 action被触发： ', menus)
        commit(types.changeMenusByPlatId, menus)
    },
    changePlat({commit}, platId) {
        console.log('切换平台 action:', platId)
        commit(types.changePlat, platId)
    }
}
