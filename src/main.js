// JS Imports
// –– Vue
import Vue from 'vue'
// –– Vue Router
import router from './router'
// –– Vuex Store
import store from './store/store'
// –– Root Vue Template
import App from './App.vue'

// Vue Configs
// –– Silence production tip in console
Vue.config.productionTip = false


// setup and start app
function begin() {
    // begin render
    window.app = new Vue({
        el: '#Main',
        store,
        router,
        render: h => h(App)
    })
}

// delay start of app to make loading spinner less jarring
setTimeout(begin, 1000)
