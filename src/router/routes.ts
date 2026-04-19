import { RouteRecordRaw } from 'vue-router';

import ROUTE_WEB from '../modules/web/router';
import ROUTE_REGISTRATION from '../modules/registration/registration.routes';
import ROUTE_DOMAINS from '../modules/domains/domains.routes';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      ...ROUTE_WEB,
      ...ROUTE_REGISTRATION,
      ...ROUTE_DOMAINS
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
