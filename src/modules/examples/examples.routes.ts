export default [
  {
    path: 'examples',
    name: 'example-list',
    component: () => import(/* webpackChunkName: "Example" */ 'src/modules/examples/pages/DomainListBasicPage.vue'),
  },
  {
    path: 'examples-pro',
    name: 'example-list-professional',
    component: () => import(/* webpackChunkName: "Example" */ 'src/modules/examples/pages/DomainListProfessionalPage.vue'),
  },
  {
    path: 'examples-pre',
    name: 'example-list-premium',
    component: () => import(/* webpackChunkName: "Example" */ 'src/modules/examples/pages/DomainListPremiumPage.vue'),
  },
  {
    path: 'examples/new',
    name: 'example-create',
    component: () => import(/* webpackChunkName: "Example" */ 'src/modules/examples/pages/DomainFormBasicPage.vue'),

  },
  {
    path: 'examples/new-pro',
    name: 'example-create-pro',
    component: () => import(/* webpackChunkName: "Example" */ 'src/modules/examples/pages/DomainFormProfessionalPage.vue'),

  },
  {
    path: 'examples/:id/edit',
    name: 'example-edit',
    component: () => import(/* webpackChunkName: "Example" */ 'src/modules/examples/pages/DomainFormPage.vue'),
  }
];
