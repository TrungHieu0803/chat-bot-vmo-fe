import component from "@/locales/bn-BD/component";

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/all-spaces',
    name: 'Spaces',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard',
        redirect: '/my-space',
      },
      {
        name: 'Tất cả spaces',
        icon: 'smile',
        path: '/all-spaces',
        component: './space/spaces',
      },
      {
        name: 'Space của tôi',
        icon: 'smile',
        path: '/my-space',
        component: './space/my-space',
      },
    ],
  },
  {
    path: '/my-space',
    component: './space/my-space',
  },
  {
    path: '/space/detail/:spaceId',
    component: './space/space-detail'
  },
  {
    path: '/',
    redirect: '/all-spaces',
  },
  {
    component: './404',
  },
];
