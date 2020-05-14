/* eslint-disable no-plusplus */
/* eslint-disable radix */
import React from 'react'
import * as Icon from "@ant-design/icons"
import { NumberOutlined } from '@ant-design/icons'

// 遍历获取路由树状结构
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
      const children = getCatRoutes(categories, id)
      if (children.length > 0) {
        if (parseInt(used) === 1) {
          children.unshift({
            'parent_id': parentId,
            'value': parseInt(id),
            'name': name,
            'used': parseInt(used),
            'icon': <NumberOutlined style={{margin:0}} />,
            path: `${name}*`,
          })
        }
        tmp.children = children
      }
      data.push(tmp)
    }
  }
  return data
}

// 遍历获取分类树状结构
export function getCatChildren(categories, categoryId) {
  if (categories.length === 0) return []
  const data = []
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].parent_id === categoryId) {
      const tmp = {
        'parent_id': parseInt(categories[i].parent_id),
        'value': parseInt(categories[i].id),
        'label': categories[i].name,
      }
      const children = getCatChildren(categories, categories[i].id)
      if (children.length > 0) tmp.children = children
      data.push(tmp)
    }
  }
  return data
}

// get parent categories
export function getCategories(categoryId, data = [], categories) {
  for (let i = 0; i < categories.length; i++) {
    if (parseInt(categories[i].id) === parseInt(categoryId)) {
      getCategories(categories[i].parent_id, data, categories)
      data.push(parseInt(categoryId))
    }
  }
  return data
}


/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
