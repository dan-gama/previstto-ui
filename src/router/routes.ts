import { RouteRecordRaw } from 'vue-router';

import ROUTE_WEB from '../modules/web/router';
import ROUTE_DOMAINS from '../modules/examples/examples.routes';
import ROUTE_BANK_ACCOUNTS from '../modules/bank-accounts/bank-account.routes'
import ROUTE_CREDIT_CARDS from '../modules/credit-cards/credit-card.routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      ...ROUTE_WEB,
      ...ROUTE_DOMAINS,
      ...ROUTE_BANK_ACCOUNTS,
      ...ROUTE_CREDIT_CARDS,
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
