import { RouteRecordRaw } from 'vue-router';

import ROUTE_WEB from '../modules/web/router';
import ROUTE_DOMAINS from '../modules/examples/examples.routes';
import ROUTE_BANK_ACCOUNTS from '../modules/bank-accounts/bank-accounts.routes'
import ROUTE_CREDIT_CARDS from '../modules/credit-cards/credit-cards.routes'
import ROUTE_CATEGORIES from '@/modules/categories/categories.routes'
import ROUTE_PERSONS from '@/modules/persons/persons.routes'
import ROUTE_AGENDA from '@/modules/agenda/agenda.routes'

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
      ...ROUTE_CATEGORIES,
      ...ROUTE_PERSONS,
      ...ROUTE_AGENDA,
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
