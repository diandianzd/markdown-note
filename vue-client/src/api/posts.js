import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/posts/list',
    method: 'post',
    params: query
  })
}
export function fetchArticle(id) {
  return request({
    url: '/posts/view',
    method: 'post',
    params: { id }
  })
}

export function deleteArticle(id) {
  return request({
    url: '/posts/delete',
    method: 'post',
    data: { id }
  })
}

export function createArticle(data) {
  return request({
    url: '/posts/save',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/posts/property',
    method: 'post',
    data
  })
}
