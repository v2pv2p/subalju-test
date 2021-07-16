import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import Board from '@/pages/board'
import AddBoard from '@/pages/board/addBoard'

Vue.use( Router )

export default new Router( {
  routes: [
    { path: '/home', name: 'home', component: Home },
    { path: '/board', name: 'board', component: Board },
    { path: '/addboard', name: 'addBoard', component: AddBoard },
    { path: '/', component: Home },
  ]
} )
