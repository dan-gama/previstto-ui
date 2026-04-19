export default [
  {
    name: 'Home',
    path: '/home',
    component: () => import(/* webpackChunkName: "Web" */ './pages/HomePage.vue'),
  }
];
