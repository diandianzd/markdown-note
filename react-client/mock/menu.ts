import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {

  'POST disable/api/categories/menudata': (req: Request, res: Response) => {
    res.send([
        
        {
            path: '/welcome',
            name: '欢迎',
            icon: 'smile',
        },
        {
            path: '/welcome1',
            name: '欢迎',
            icon: 'smile',
        }
    ]);
  },

};
