import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/users/login', {
    method: 'POST',
    data: params,
  });
}

export async function usersHeart() {
  return request('/api/users/heart', {
    method: 'POST',
  });
}

export async function usersLogout() {
  return request('/api/users/logout', {
    method: 'POST',
  });
}


export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
