export default [
  {
    url: '/mock/categories/menudata',
    type: 'post',
    response: () => {
      return {
        'code': 1, 'message': 'success', 'data': [
          { 'icon': 'BugOutlined', 'id': 1, 'name': 'sunshine', 'parent_id': 0, 'used': 1 },
          { 'icon': 'CodepenOutlined', 'id': 2, 'name': '分类', 'parent_id': 0, 'used': 0 },
          { 'icon': '', 'id': 3, 'name': '多层分类', 'parent_id': 2, 'used': 1 },
        ],
      };
    },
  },
  {
    url: '/mock/categories/save',
    type: 'post',
    response: () => {
      return { 'code': 1, 'message': 'success', 'data': { 'id': 103, 'isNewPost': 0 } };
    },
  },
  {
    url: '/mock/categories/delete',
    type: 'post',
    response: () => {
      return { 'code': 0, 'message': 'mock不支持删除', 'data': null };
    },
  },


];

