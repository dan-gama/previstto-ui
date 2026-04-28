export default [
  {
    path: 'bank-accounts',
    name: 'bank-account-list',
    component: () => import(/* webpackChunkName: "BankAccount" */ 'src/modules/bank-accounts/pages/BankAccountListPage.vue'),
  },
  {
    path: 'bank-accounts/new',
    name: 'bank-account-new',
    component: () => import(/* webpackChunkName: "BankAccount" */ 'src/modules/bank-accounts/pages/BankAccountFormPage.vue'),
  },
  {
    path: 'bank-accounts/:id/edit',
    name: 'bank-account-edit',
    component: () => import(/* webpackChunkName: "BankAccount" */ 'src/modules/bank-accounts/pages/BankAccountFormPage.vue'),
  }
]
