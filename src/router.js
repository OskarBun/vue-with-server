// JS Imports
// –– Vue
import Vue from 'vue'
// –– Vue Router
import Router from 'vue-router'

// –– Pages
import HomePage from './pages/home.vue'

// Vue Configs
// –– Vue Router
Vue.use(Router)


export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomePage
        }
    ]
})
