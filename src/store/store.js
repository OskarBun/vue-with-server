// JS Imports
// –– Vue
import Vue from 'vue'
import Vuex from 'vuex'
// –– Websocket
import {vuex_ws} from '../ws';
// –– Models


// Configs
// –– Use Vuex
Vue.use(Vuex)


// init store
const store = new Vuex.Store({
    modules: {

    },
    plugins: [vuex_ws]
})

export default store

// Hot reload modules
if (module.hot) {
    // accept actions and mutations as hot modules
    module.hot.accept([], () => {
        // swap in the new actions and mutations
        store.hotUpdate({
            modules: {
                
            }
        })
    })
}
