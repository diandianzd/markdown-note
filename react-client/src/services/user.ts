import request from '@/utils/request-axios';

export async function query(): Promise<any> {
  return request('/users');
}


export async function queryNotices(): Promise<any> {
  return request('/notices');
}
