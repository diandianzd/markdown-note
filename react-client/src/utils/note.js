/* eslint-disable no-plusplus */
/* eslint-disable radix */
import React from 'react'
import * as Icon from "@ant-design/icons"

// 遍历获取分类树状结构
export function getCatRoutes(categories, categoryId) {
  if (categories.length === 0) return []
  const data = []
  for (let i = 0; i < categories.length; i++) {
    const { parent_id: parentId, name, id, used, icon } = categories[i]
    // eslint-disable-next-line dot-notation
    const IconComponent = Icon[icon]

    if (parentId === categoryId) {
      const tmp = {
        'parent_id': parentId,
        'value': parseInt(id),
        'name': name,
        'used': parseInt(used),
        'icon': IconComponent && <IconComponent />,
        path: (parentId === 0 ? 'articles/' : '') + name,
      }
      const routes = getCatRoutes(categories, id)
      if (routes.length > 0) {
        if (parseInt(used) === 1) {
          routes.unshift({
            'parent_id': parentId,
            'value': parseInt(id),
            'name': name,
            'used': parseInt(used),
            'icon': IconComponent && <IconComponent />,
            path: `${name}*`,
          })
        }
        tmp.routes = routes
      }
      data.push(tmp)
    }
  }
  return data
}

// get parent categories
export function getCategories(categoryId, data = [], categories) {
  /* const {categories} = store.state.user
  if (categories.length === 0) return [] */
  for (let i = 0; i < categories.length; i++) {
    if (parseInt(categories[i].id) === parseInt(categoryId)) {
      getCategories(categories[i].parent_id, data, categories)
      data.push(parseInt(categoryId))
    }
  }
  return data
}
