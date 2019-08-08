import * as types from './types'

export default {
    [types.EXPAND_MENU]: (state) => {
        state.expand = !state.expand
    },

    [types.contCatalogId]: (state, contCatalogId) => {
        console.log('mutation被触发，参数', state, contCatalogId);
        state.contCatalogId = contCatalogId;
    },

    [types.changeMenusByPlatId]: (state, menus) => {
        console.log('根据平台id修改菜单 mutation被触发，参数', state);
        sessionStorage.setItem("menus", JSON.stringify(menus));
        state.menus = menus;
    },

    [types.changePlat]: (state, platId) => {
        // console.log('切换平台 mutation:', platId)
        // sessionStorage.setItem("platId", platId);
        state.platId = platId
    }
}
