import request from '@/utils/request-axios';

export async function fetchHistory(query: any) {
  return request('/articles/view-history', {
    method: 'POST',
    params: query
  })
}

export async function fetchList(query: any) {
  return request('/articles/list', {
    method: 'POST',
    params: query
  })
}

export async function fetchArticle(id: any) {
  return request('/articles/view', {
    method: 'POST',
    params: {id}
  })
}

export async function deleteArticle(id: any) {
  return request('/articles/delete', {
    method: 'POST',
    data: {id}
  })
}

export async function createArticle(data: any) {
  return request('/articles/save', {
    method: 'POST',
    data
  })
}
