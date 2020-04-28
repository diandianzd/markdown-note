import request from '@/utils/request';

export async function fetchList(query: any) {
    return request('/api/posts/list', {
        method: 'POST',
        params: query
    })
}
export async function fetchArticle(id: any) {
    return request('/api/posts/view', {
        method: 'POST',
        params: { id }
    })
}

export async function deleteArticle(id: any) {
    return request('/api/posts/delete', {
        method: 'POST',
        data: { id }
    })
}

export async function createArticle(data: any) {
    return request('/api/posts/save', {
        method: 'POST',
        data
    })
}
