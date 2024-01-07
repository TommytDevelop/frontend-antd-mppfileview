export default [
  {
    path: '/MppFileUpload',
    name: 'MppFileUpload',
    icon: 'smile',
    component: './MppFileUpload',
  },
  {
    name: 'MppFileView',
    icon: 'table',
    path: '/MppFileView',
    component: './MppFileView',
  },
  {
    path: '/',
    redirect: '/MppFileUpload',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
