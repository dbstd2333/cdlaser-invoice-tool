import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

/**
 * Vue Router 配置。
 * 根路径 / 固定重定向到 /inventory，未知业务路由也回退到 /inventory。
 * 应用每次启动都以 /inventory 作为初始路由。
 */

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/inventory' },
  {
    path: '/customers',
    name: 'customers',
    component: () => import('../pages/customers/CustomersPage.vue'),
    meta: { title: '客户管理' },
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('../pages/inventory/InventoryPage.vue'),
    meta: { title: '商品、库存与开票' },
  },
  {
    path: '/outbound-records',
    name: 'outbound-records',
    component: () => import('../pages/outbound-records/OutboundRecordsPage.vue'),
    meta: { title: '开票记录' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/inventory' },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
