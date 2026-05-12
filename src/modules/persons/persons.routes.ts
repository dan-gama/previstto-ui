export default [
  {
    path: 'persons',
    name: 'person-list',
    component: () => import(/* webpackChunkName: "Persons" */ 'src/modules/persons/pages/PersonListPage.vue'),
  },
  {
    path: 'persons/new',
    name: 'person-new',
    component: () => import(/* webpackChunkName: "Persons" */ 'src/modules/persons/pages/PersonFormPage.vue'),
  },
  {
    path: 'persons/:id/edit',
    name: 'person-edit',
    component: () => import(/* webpackChunkName: "Persons" */ 'src/modules/persons/pages/PersonFormPage.vue'),
  }
]
