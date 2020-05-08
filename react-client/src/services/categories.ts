import request from '@/utils/request-axios';

export async function deleteCategory(id: any) {
  return request('/categories/delete', {
    method: 'POST',
    data: { id }
  })
}

export async function saveCategory(data: any) {
  return request('/categories/save', {
    method: 'POST',
    data
  })
}

export async function getMenuData() {
  return request(`/categories/menudata`,{
    method: 'POST',
  });
}
