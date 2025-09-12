// 导航菜单配置（与路由解耦）
// 仅控制侧边栏展示；某些内页（如预览、详情）可设置 hidden: true

const menuConfig = [
  {
    path: '/index',
    meta: { title: '首页', icon: 'home' }
  },
  // { path: '/collect/list', meta: { title: '收集首页', icon: 'collection' } },
  // { path: '/collect/add', meta: { title: '新增分组', icon: 'plus' } },
  { path: '/collect/groupList', meta: { title: '我的收集', icon: 'user' } },
  // { path: '/collect/preview/:id?', meta: { title: '收集预览', icon: 'eye', hidden: true } }
  // {
  //   path: '/collect',
  //   meta: { title: '提示词收集', icon: 'collection' },
  //   children: [
      
  //   ]
  // },
  // {
  //   path: '/detail/:id?',
  //   meta: { title: '详情', icon: 'file-text', hidden: true }
  // }
]

export default menuConfig
