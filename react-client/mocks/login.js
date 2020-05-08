export default [
  {
    url: '/mock/users/login',
    type: 'post',
    response: () => {
      return {
        'code': 1,
        'message': '操作成功',
        'data': {
          'id': 1,
          'username': 'admin',
          'access_token': '408e45346c4e7b7fe2e899c128a2ddd7',
          'currentAuthority': 'admin',
        },
      };
    },
  },
];

