import request from '@/utils/request';

export async function fetchList(query: any) {
  return request('/api/categories/list', {
    method: 'POST',
    params: query
  })
}

export async function deleteCategory(id: any) {
  return request('/api/categories/delete', {
    method: 'POST',
    data: { id }
  })
}

export async function saveCategory(data: any) {
  return request('/api/categories/save', {
    method: 'POST',
    data
  })
}