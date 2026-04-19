export default [
    {
      path: 'register',
      name: 'Register',
      component: () => import(/* webpackChunkName: "Registration" */ 'src/modules/registration/presentation/pages/RegisterPage.vue'),
    },
    {
      path: 'register2',
      name: 'RegisterWizard',
      component: () => import(/* webpackChunkName: "Registration" */ 'src/modules/registration/presentation/pages/RegisterWizardPage.vue'),
    }
];
