const accessToken = sessionStorage.getItem('accessToken') ? sessionStorage.getItem('accessToken') : ''
const refreshToken = sessionStorage.getItem('refreshToken') ? sessionStorage.getItem('refreshToken') : ''
const platId = sessionStorage.getItem('platId') ? sessionStorage.getItem('platId') : ''
const menus = sessionStorage.getItem('menus') ? JSON.parse(sessionStorage.getItem('menus')) : []
const state = {
    accessToken,
    refreshToken,
    platId,
    menus,
    expand: false,
    contCatalogId: '', // 所选栏目id,
};

export default state;
