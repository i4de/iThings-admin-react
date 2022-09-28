export default [
  {
    path: '/user',
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    layout: false,
    routes: [
      {
        path: '/deviceMangers',
        name: '设备管理',
        icon: 'icon_data_01',
        routes: [
          {
            name: '产品',
            path: '/deviceMangers/product/index',
            component: './deviceMangers/product/index',
          },
          {
            name: '产品详情',
            hideInMenu: true,
            path: '/deviceMangers/product/detail/:id',
            component: './deviceMangers/product/detail/index',
          },
          {
            name: '设备',
            path: '/deviceMangers/device/index',
            component: './deviceMangers/device/index',
          },
          {
            name: '设备详情',
            hideInMenu: true,
            path: '/deviceMangers/device/detail/:id/:name',
            component: './deviceMangers/device/detail/index',
          },
        ],
      },
      {
        path: '/systemMangers',
        name: '系统管理',
        icon: 'icon_system',
        access: 'canAdmin',
        routes: [
          {
            name: '用户管理',
            path: '/systemMangers/user/index',
            component: './systemMangers/user/index',
          },
          {
            name: '角色管理',
            path: '/systemMangers/role/index',
            component: './systemMangers/role/index',
          },
          {
            name: '菜单管理',
            path: '/systemMangers/menu/index',
            component: './systemMangers/menu/index',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/logMangers',
        name: '日志管理',
        icon: 'icon_system',
        access: 'canAdmin',
        routes: [
          {
            name: '操作日志',
            path: '/logMangers/operation/index',
            component: './logMangers/operation/index',
          },
          // {
          //   name: '登录日志',
          //   path: '/logMangers/role/index',
          //   component: './logMangers/role/index',
          // },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        redirect: '/deviceMangers/product/index',
      },
      {
        component: '404',
      },
    ],
  },
  {
    layout: false,
    component: '404',
  },
];
