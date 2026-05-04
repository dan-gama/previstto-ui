export default [
  {
    path: 'categories',
    name: 'category',
    component: () => import(/* webpackChunkName: "CreditCard" */ 'src/modules/categories/pages/CategoryManagerPage.vue'),
  },
]
