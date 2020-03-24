/** When your routing post is too long, you can split it into small modules **/

import Layout from '@/layout'

const exportRouter = {
  path: '/post',
  component: Layout,
  redirect: '/post/list',
  name: 'Post',
  hidden: true,
  meta: {
    title: 'article',
    icon: 'edit'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/post/list'),
      name: 'articleList',
      meta: { title: 'articleList' }
    },
    {
      path: 'search',
      component: () => import('@/views/post/tab'),
      name: 'articleSearch',
      meta: { title: 'articleList' }
    },
    {
      path: 'unCategorized',
      component: () => import('@/views/post/tab'),
      name: 'articleUnCategorized',
      meta: { title: '未分类', categories: [-1] }
    },
    {
      path: 'create',
      component: () => import('@/views/post/create'),
      name: 'createArticle',
      meta: { title: 'createArticle' }
    },
    {
      path: 'update',
      component: () => import('@/views/post/edit'),
      name: 'editArticle',
      meta: { title: 'editArticle' },
      hidden: true
    }
  ]
}
export default exportRouter
