export default [
  {
    path: 'bank-accounts',
    name: 'bank-accounts-list',
    component: () => import(/* webpackChunkName: "BankAccount" */ 'src/modules/bank-accounts/pages/BankAccountListPage.vue'),
  },
]

