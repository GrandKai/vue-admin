export default {
    expand: state => state.expand,
    contCatalogId: state => state.contCatalogId,
    // 让 getter 返回一个函数，来实现给 getter 传参
    // getTodoById: (state) => (id) => {
    //     return state.todos.find(todo => todo.id === id)
    //   }
//    调用store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
}
