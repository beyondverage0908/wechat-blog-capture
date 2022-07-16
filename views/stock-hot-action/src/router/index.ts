import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 路由信息
let routes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("/@/views/dashbord/index.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("/@/views/jiucaigongshe/action/index.vue"),
  },
  {
    path: "/action-detail",
    name: "action-detail",
    component: () => import("/@/views/jiucaigongshe/action-detail/index.vue"),
  },
];

// 路由器
const router = createRouter({
  history: createWebHistory(), // HTML5模式
  routes,
});

export default router;
