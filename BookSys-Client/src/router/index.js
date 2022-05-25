import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/super',
    component: Layout,
    name: 'Super',
    meta: {title: '超级管理员', icon: 'el-icon-s-order'},
    children: [
      {
        path: '/super/user',
        name: 'User',
        component: () => import('@/views/user'),
        meta: { title: '用户管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/manager',
    component: Layout,
    name: 'Manager',
    meta: {title: '图书管理员', icon: 'el-icon-s-order'},
    redirect: '/manager/book',
    children: [
      {
        path: '/manager/book',
        name: 'Book',
        component: () => import('@/views/book'),
        meta: { title: '图书管理', icon: 'form' }
      },
      {
        path: '/manager/records',
        name: 'Records',
        component: () => import('@/views/records'),
        meta: { title: '总借阅情况', icon: 'form' }
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    name: 'Student',
    meta: {title: '读者端', icon: 'el-icon-s-order'},
    redirect: '/student/search',
    children: [
      {
        path: '/student/search',
        name: 'Search',
        component: () => import('@/views/search'),
        meta: { title: '图书检索', icon: 'form' }
      },
      {
        path: '/student/record',
        name: 'Record',
        component: () => import('@/views/records'),
        meta: { title: '借阅历史', icon: 'form' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
