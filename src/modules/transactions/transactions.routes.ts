export default [
  {
    path: 'transactions',
    name: 'transaction',
    component: () => import(/* webpackChunkName: "Transactions" */ 'src/modules/transactions/pages/TransactionManagerPage.vue'),
  },
]
