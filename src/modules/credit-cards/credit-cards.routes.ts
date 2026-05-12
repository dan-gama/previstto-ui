export default [
  {
    path: 'credit-cards',
    name: 'credit-card-list',
    component: () => import(/* webpackChunkName: "CreditCard" */ 'src/modules/credit-cards/pages/CreditCardListPage.vue'),
  },
  {
    path: 'credit-cards/new',
    name: 'credit-card-new',
    component: () => import(/* webpackChunkName: "CreditCard" */ 'src/modules/credit-cards/pages/CreditCardFormPage.vue'),
  },
  {
    path: 'credit-cards/:id/edit',
    name: 'credit-card-edit',
    component: () => import(/* webpackChunkName: "CreditCard" */ 'src/modules/credit-cards/pages/CreditCardFormPage.vue'),
  }
]
