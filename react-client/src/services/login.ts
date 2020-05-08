import request from '@/utils/request-axios';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/users/login', {
    method: 'POST',
    data: params,
  });
}

export async function usersHeart() {
  return request('/users/heart', {
    method: 'POST',
  });
}

export async function usersLogout() {
  return request('/users/logout', {
    method: 'POST',
  });
}


export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
