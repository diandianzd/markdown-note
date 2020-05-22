export default {
  history: {
    type: 'hash',
  },
  define: {
    'process.env.API_SERVER': "/mock", // 接口服务器地址
    'process.env.PLATFORM': "github", // 接口服务器地址
  },
  publicPath: './',
};
