import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/categories/list',
    method: 'post',
    params: query
  })
}

export function deleteCategory(id) {
  return request({
    url: '/categories/delete',
    method: 'post',
    data: { id }
  })
}

export function saveCategory(data) {
  return request({
    url: '/categories/save',
    method: 'post',
    data
  })
}
