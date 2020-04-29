import request from '@/utils/request';

export async function fetchList(query: any) {
    return request('/api/articles/list', {
        method: 'POST',
        params: query
    })
}
export async function fetchArticle(id: any) {
    return request('/api/articles/view', {
        method: 'POST',
        params: { id }
    })
}

export async function deleteArticle(id: any) {
    return request('/api/articles/delete', {
        method: 'POST',
        data: { id }
    })
}

export async function createArticle(data: any) {
    return request('/api/articles/save', {
        method: 'POST',
        data
    })
}
