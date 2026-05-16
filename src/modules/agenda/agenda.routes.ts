export default [
  {
    path: 'agenda',
    name: 'agenda',
    component: () => import(/* webpackChunkName: "CreditCard" */ 'src/modules/agenda/pages/AgendaManagerPage.vue'),
  },
]
