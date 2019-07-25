import * as types from './types'

export default {
    [types.EXPAND_MENU]: (state) => {
        state.expand = !state.expand
    }
}