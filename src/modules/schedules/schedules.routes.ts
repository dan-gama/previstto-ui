export default [
  {
    path: 'schedules',
    name: 'schedule',
    component: () => import(/* webpackChunkName: "Schedules" */ 'src/modules/schedules/pages/ScheduleManagerPage.vue'),
  },
]
