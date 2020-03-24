import store from '@/store'

// 遍历获取分类树状结构
export function getCatChildren(categories, categoryId) {
  if (categories.length === 0) return []
  const data = []
  for (let i = 0; i < categories.length; i++) {
    if (categories[i]['parent_id'] === categoryId) {
      const tmp = {
        'parent_id': categories[i]['parent_id'],
        'value': parseInt(categories[i]['id']),
        'label': categories[i]['name'],
        'used': parseInt(categories[i]['used']),
        'icon': categories[i]['icon']
      }
      const children = getCatChildren(categories, categories[i]['id'])
      if (children.length > 0) tmp['children'] = children
      data.push(tmp)
    }
  }
  return data
}

// get parent categories
export function getCategories(categoryId, data = []) {
  const categories = store.state.user.categories
  if (categories.length === 0) return []
  for (let i = 0; i < categories.length; i++) {
    if (parseInt(categories[i]['id']) === parseInt(categoryId)) {
      getCategories(categories[i]['parent_id'], data)
      data.push(parseInt(categoryId))
    }
  }
  return data
}
