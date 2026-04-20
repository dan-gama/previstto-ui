export default [
  {
    path: 'domains',
    name: 'domain-list',
    component: () => import(/* webpackChunkName: "Registration" */ 'src/modules/domains/pages/DomainListBasicPage.vue'),
  },
  {
    path: 'domains-pro',
    name: 'domain-list-professional',
    component: () => import(/* webpackChunkName: "Registration" */ 'src/modules/domains/pages/DomainListProfessionalPage.vue'),
  },
  {
    path: 'domains-pre',
    name: 'domain-list-premium',
    component: () => import(/* webpackChunkName: "Registration" */ 'src/modules/domains/pages/DomainListPremiumPage.vue'),
  },
  {
    path: 'domains/new',
    name: 'domain-create',
    component: () => import(/* webpackChunkName: "Registration" */ 'src/modules/domains/pages/DomainFormBasicPage.vue'),

  },
  {
    path: 'domains/new-pro',
    name: 'domain-create-pro',
    component: () => import(/* webpackChunkName: "Registration" */ 'src/modules/domains/pages/DomainFormProfessionalPage.vue'),

  },
  {
    path: 'domains/:id/edit',
    name: 'domain-edit',
    component: () => import(/* webpackChunkName: "Registration" */ 'src/modules/domains/pages/DomainFormPage.vue'),
  }
];
