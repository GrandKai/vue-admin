export default {
    // vuex 和 session 结合起来使用，这样使用 token 的地方就可以直接从 mapGetter 中获取 token
    accessToken: state => sessionStorage.getItem('accessToken') ? sessionStorage.getItem('accessToken') : state.accessToken,
    refreshToken: state => sessionStorage.getItem('refreshToken') ? sessionStorage.getItem('refreshToken') : state.refreshToken,
    expand: state => state.expand,
    contCatalogId: state => state.contCatalogId,
    platId: state => state.platId,
    menus: state => state.menus


    // 让 getter 返回一个函数，来实现给 getter 传参
    // getTodoById: (state) => (id) => {
    //     return state.todos.find(todo => todo.id === id)
    //   }
//    调用store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
}
