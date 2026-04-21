export default [
  {
    path: 'bank-accounts',
    name: 'bank-accounts-list',
    component: () => import(/* webpackChunkName: "BankAccount" */ 'src/modules/bank-accounts/pages/BankAccountListPage.vue'),
  },
  {
    path: 'bank-accounts/new',
    name: 'bank-account-new',
    component: () => import(/* webpackChunkName: "BankAccount" */ 'src/modules/bank-accounts/pages/BankAccountFormPage.vue'),
  },
]

