/** When your routing categories is too long, you can split it into small modules **/

import Layout from '@/layout'

const exportRouter = {
  path: '/categories',
  component: Layout,
  redirect: '/categories/list',
  name: 'Categories',
  hidden: true,
  meta: {
    title: 'category',
    icon: 'list'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/categories/list'),
      name: '分类列表',
      meta: { title: 'categoryList' }
    }
  ]
}
export default exportRouter
