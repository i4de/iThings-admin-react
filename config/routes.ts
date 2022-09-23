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
            path: '/deviceMangers/device/detail/:id',
            component: './deviceMangers/device/detail/index',
          },
          {
            name: '分组',
            path: '/deviceMangers/group/index',
            component: './deviceMangers/group/index',
          },
          {
            name: '分组详情',
            hideInMenu: true,
            path: '/deviceMangers/group/detail/:id',
            component: './deviceMangers/group/detail/index',
          },
        ],
      },
      {
        path: '/systermManager',
        name: '系统管理',
        icon: 'icon_system',
        routes: [
          {
            name: '用户管理',
            path: '/systermManager/user',
            component: './systerm',
          },
        ],
      },
      {
        path: '/visualizeManagers',
        name: '可视化',
        icon: 'icon_system',
        routes: [
          {
            name: '大屏',
            path: '/visualizeManagers/largeScreen/index',
            component: './visualizeManagers/largeScreen/index',
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
];
