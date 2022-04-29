import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'AppLogin',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'AppHome',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Home.vue')
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径  from  从哪个路径开始  next('/login') 一个函数，表示放行，强制跳转至login
  // 通过登录页面，放行
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  // 如果没有token，则强制跳转会登录界面
  if (!token) return next('/login')
  next()
})

export default router
