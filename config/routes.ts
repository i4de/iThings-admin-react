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
        path: '/operationsMonitorings',
        name: '运维监控',
        icon: 'icon_system',
        routes: [
          {
            name: '在线调试',
            path: '/operationsMonitorings/onlineDebugs/index',
            component: './operationsMonitorings/onlineDebug/index',
          },
          {
            name: '日志服务',
            path: '/operationsMonitorings/logService/index',
            component: './operationsMonitorings/logService/index',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/visualizations',
        name: '可视化',
        icon: 'icon_system',
        routes: [
          // {
          //   name: '看板',
          //   path: '/visualizations/view/index',
          //   component: './visualizations/view/index',
          // },
          {
            name: '大屏',
            path: '/visualizations/screen/index',
            component: './visualizations/screen/index',
          },
          {
            name: '大屏详情',
            hideInMenu: true,
            path: '/visualizations/screen/detail/:id',
            component: './visualizations/screen/detail/index',
          },
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
